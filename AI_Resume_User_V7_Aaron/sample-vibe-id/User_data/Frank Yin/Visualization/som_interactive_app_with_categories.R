# SOM Clustering Interactive Visualization App with Categorical Variables
# Interactive Shiny application for SOM clustering analysis of HIFLO comorbidity data
# Enhanced version with Age and BMI categorical variables (one-hot encoded with custom weighting)

# Load required libraries
library(shiny)
library(shinydashboard)
library(shinyWidgets)
library(kohonen)
library(cluster)
library(fpc)
library(clValid)
library(clusterSim)
library(ggplot2)
library(dplyr)
library(tidyr)
library(hexbin)
library(viridis)
library(RColorBrewer)
library(gridExtra)
library(grid)

# Set global options
options(shiny.maxRequestSize = 30*1024^2) # 30MB max file size

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

# Function to categorize age
categorize_age <- function(age) {
  case_when(
    age <= 55 ~ "<55",
    age > 55 & age <= 65 ~ "55-65",
    age > 65 ~ ">65",
    TRUE ~ NA_character_
  )
}

# Function to categorize BMI
categorize_bmi <- function(bmi) {
  case_when(
    bmi < 18.5 ~ "Underweight",
    bmi >= 18.5 & bmi < 25.0 ~ "Normal",
    bmi >= 25.0 & bmi < 30.0 ~ "Overweight",
    bmi >= 30.0 ~ "Obesity",
    TRUE ~ NA_character_
  )
}

# Function to one-hot encode a categorical variable
one_hot_encode <- function(category_vector, prefix) {
  categories <- unique(category_vector[!is.na(category_vector)])
  categories <- sort(categories)  # For consistent ordering

  result <- data.frame(matrix(0, nrow = length(category_vector), ncol = length(categories)))
  colnames(result) <- paste0(prefix, "_", categories)

  for (i in seq_along(category_vector)) {
    if (!is.na(category_vector[i])) {
      col_name <- paste0(prefix, "_", category_vector[i])
      result[i, col_name] <- 1
    }
  }

  return(result)
}

# Function to calculate clustering metrics
calculate_all_metrics <- function(k, codes, data_matrix) {
  if (k < 2) return(list(silhouette = NA, calinski = NA, davies_bouldin = NA, dunn = NA))

  # Perform hierarchical clustering
  hc <- hclust(dist(codes), method = "ward.D2")
  cluster_assignment <- cutree(hc, k)

  # Calculate distance matrix
  dist_matrix <- dist(codes)
  dist_matrix_full <- as.matrix(dist_matrix)

  # 1. Silhouette Coefficient
  sil <- silhouette(cluster_assignment, dist_matrix)
  silhouette_score <- mean(sil[, 3])

  # 2. Calculate cluster stats for Calinski-Harabasz
  stats <- tryCatch({
    fpc::cluster.stats(dist_matrix, cluster_assignment)
  }, error = function(e) NULL)

  ch_index <- if(!is.null(stats) && !is.null(stats$ch)) stats$ch else NA

  # 3. Dunn Index
  dunn_index <- tryCatch({
    clValid::dunn(distance = dist_matrix_full, clusters = cluster_assignment)
  }, error = function(e) NA)

  # 4. Davies-Bouldin Index
  db_index <- tryCatch({
    clusterSim::index.DB(codes, cluster_assignment, centrotypes="centroids")$DB
  }, error = function(e) NA)

  return(list(
    silhouette = silhouette_score,
    calinski = ch_index,
    davies_bouldin = db_index,
    dunn = dunn_index
  ))
}

# ============================================================================
# USER INTERFACE
# ============================================================================

ui <- dashboardPage(
  dashboardHeader(title = "SOM Clustering with Age/BMI Categories"),

  dashboardSidebar(
    width = 250,
    sidebarMenu(
      id = "sidebar",
      menuItem("Clustering Metrics", tabName = "metrics", icon = icon("chart-line")),
      menuItem("SOM Visualization", tabName = "visualization", icon = icon("project-diagram")),
      menuItem("About", tabName = "about", icon = icon("info-circle"))
    ),

    hr(),

    # Global controls
    h4("SOM Grid Settings", style = "padding-left: 15px;"),

    sliderInput("som_x",
                "Grid Width (X):",
                min = 4,
                max = 12,
                value = 8,
                step = 1),

    sliderInput("som_y",
                "Grid Height (Y):",
                min = 4,
                max = 12,
                value = 8,
                step = 1),

    conditionalPanel(
      condition = "input.sidebar == 'visualization'",
      sliderInput("n_clusters",
                  "Number of Clusters:",
                  min = 2,
                  max = 10,
                  value = 6,
                  step = 1)
    ),

    hr(),

    actionButton("train_som",
                 "Train/Update SOM",
                 icon = icon("play"),
                 width = "90%",
                 class = "btn-primary"),

    br(),
    br(),

    # Status indicator
    verbatimTextOutput("status_text")
  ),

  dashboardBody(
    # Add custom CSS
    tags$head(
      tags$style(HTML("
        .content-wrapper, .right-side {
          background-color: #f4f4f4;
        }
        .nav-tabs-custom > .tab-content {
          background-color: white;
        }
      "))
    ),

    tabItems(
      # Metrics Tab
      tabItem(
        tabName = "metrics",
        h2("Clustering Evaluation Metrics"),
        p("Analyze optimal number of clusters based on multiple validation metrics"),

        fluidRow(
          box(
            title = "Metrics Overview",
            status = "primary",
            solidHeader = TRUE,
            width = 12,

            tabsetPanel(
              tabPanel("Combined View",
                       br(),
                       plotOutput("metrics_combined", height = "600px")),

              tabPanel("Individual Metrics",
                       br(),
                       fluidRow(
                         column(6, plotOutput("silhouette_plot", height = "350px")),
                         column(6, plotOutput("calinski_plot", height = "350px"))
                       ),
                       fluidRow(
                         column(6, plotOutput("davies_plot", height = "350px")),
                         column(6, plotOutput("dunn_plot", height = "350px"))
                       )),

              tabPanel("Optimal K Analysis",
                       br(),
                       DT::dataTableOutput("metrics_table"),
                       br(),
                       verbatimTextOutput("optimal_k_summary"))
            )
          )
        )
      ),

      # Visualization Tab
      tabItem(
        tabName = "visualization",
        h2("SOM Clustering Visualizations"),
        p("Interactive visualizations of SOM clustering results"),

        fluidRow(
          # Main visualizations
          box(
            title = "SOM Grid Visualizations",
            status = "primary",
            solidHeader = TRUE,
            width = 12,

            tabsetPanel(
              tabPanel("Hexagonal Grid",
                       br(),
                       fluidRow(
                         column(6,
                                h4("Sample Distribution"),
                                plotOutput("hex_counts", height = "400px")),
                         column(6,
                                h4("Cluster Assignment"),
                                plotOutput("hex_clusters", height = "400px"))
                       )),

              tabPanel("U-Matrix",
                       br(),
                       plotOutput("umatrix", height = "500px"),
                       p("Darker regions indicate cluster boundaries")),

              tabPanel("Component Planes",
                       br(),
                       plotOutput("component_planes", height = "900px"),
                       p("SOM weights for each variable including comorbidities, age, and BMI categories")),

              tabPanel("Cluster Heatmap",
                       br(),
                       plotOutput("cluster_heatmap", height = "600px"),
                       br(),
                       DT::dataTableOutput("cluster_summary")),

              tabPanel("Age/BMI Distribution",
                       br(),
                       fluidRow(
                         column(12,
                                h4("Age Category Distribution by Cluster"),
                                plotOutput("age_distribution", height = "400px"))
                       ),
                       br(),
                       fluidRow(
                         column(12,
                                h4("BMI Category Distribution by Cluster"),
                                plotOutput("bmi_distribution", height = "400px"))
                       )),

              tabPanel("BODE Score Analysis",
                       br(),
                       fluidRow(
                         column(12,
                                h4("BODE Score Distribution by Cluster"),
                                plotOutput("bode_boxplot", height = "500px"))
                       ),
                       br(),
                       fluidRow(
                         column(12,
                                h4("BODE Score Summary Statistics by Cluster"),
                                DT::dataTableOutput("bode_summary_table"))
                       )),

              tabPanel("FEV1 Distribution",
                       br(),
                       fluidRow(
                         column(12,
                                h4("FEV1 Category Distribution by Cluster"),
                                plotOutput("fev1_distribution", height = "500px"))
                       ),
                       br(),
                       fluidRow(
                         column(12,
                                h4("FEV1 Category Summary Statistics"),
                                DT::dataTableOutput("fev1_summary"))
                       )),

              tabPanel("Cluster Validation",
                       br(),
                       h3("Chi-Square Tests"),
                       fluidRow(
                         column(12,
                                h4("Statistical Validation: Chi-Square Tests (Cluster vs Population)"),
                                p("Testing if each cluster's comorbidity prevalence differs significantly from the whole population."),
                                plotOutput("validation_heatmap", height = "600px"))
                       ),
                       br(),
                       fluidRow(
                         column(12,
                                h4("Deviation from Population Mean (Percentage Points)"),
                                plotOutput("validation_deviation", height = "800px"))
                       ),
                       br(),
                       fluidRow(
                         column(12,
                                h4("Chi-Square Test Results"),
                                DT::dataTableOutput("validation_table"))
                       ),
                       br(),
                       hr(),
                       br(),
                       h3("Fisher's Exact Tests"),
                       fluidRow(
                         column(12,
                                h4("Statistical Validation: Fisher's Exact Tests (Cluster vs Population)"),
                                p("Fisher's exact test is more accurate for small sample sizes or when cell counts are low.
                                  It computes exact p-values without relying on approximations."),
                                plotOutput("fisher_validation_heatmap", height = "600px"))
                       ),
                       br(),
                       fluidRow(
                         column(12,
                                h4("Deviation from Population Mean (Percentage Points)"),
                                plotOutput("fisher_validation_deviation", height = "800px"))
                       ),
                       br(),
                       fluidRow(
                         column(12,
                                h4("Fisher's Exact Test Results"),
                                DT::dataTableOutput("fisher_validation_table"))
                       ))
            )
          )
        ),

        fluidRow(
          # Download options
          box(
            title = "Export Options",
            status = "success",
            width = 12,

            fluidRow(
              column(3,
                     downloadButton("download_counts", "Download Counts Plot")),
              column(3,
                     downloadButton("download_clusters", "Download Clusters Plot")),
              column(3,
                     downloadButton("download_components", "Download Components")),
              column(3,
                     downloadButton("download_heatmap", "Download Heatmap"))
            ),
            br(),
            fluidRow(
              column(3,
                     downloadButton("download_age_bmi", "Download Age/BMI Dist")),
              column(3,
                     downloadButton("download_fev1", "Download FEV1 Distribution")),
              column(3,
                     downloadButton("download_bode", "Download BODE Analysis")),
              column(3,
                     downloadButton("download_validation", "Download Chi-Square Validation"))
            ),
            br(),
            fluidRow(
              column(3,
                     downloadButton("download_fisher_validation", "Download Fisher's Validation"))
            )
          )
        )
      ),

      # About Tab
      tabItem(
        tabName = "about",
        h2("About This Application"),

        box(
          title = "Overview",
          status = "info",
          solidHeader = TRUE,
          width = 12,

          p("This interactive Shiny application provides visualization and analysis tools for
            Self-Organizing Map (SOM) clustering of COPD patient data from the HIFLO dataset,
            including comorbidities, age categories, and BMI categories."),

          h4("Features:"),
          tags$ul(
            tags$li("Dynamic SOM grid size adjustment (4x4 to 12x12)"),
            tags$li("Real-time clustering metrics calculation"),
            tags$li("Multiple validation indices (Silhouette, Calinski-Harabasz, Davies-Bouldin, Dunn)"),
            tags$li("Interactive hexagonal grid visualizations"),
            tags$li("Component planes for all variables including categorical age and BMI"),
            tags$li("Cluster characterization with age and BMI distributions"),
            tags$li("Statistical validation with Chi-square and Fisher's exact tests")
          ),

          h4("Data:"),
          p("The analysis uses 19 variables total:"),
          tags$ul(
            tags$li(strong("11 Comorbidity variables (binary, weight = 1.0):"),
                    tags$ul(
                      tags$li("Hypertension, Diabetes, Heart Failure, CAD, CKD"),
                      tags$li("Asthma, Sleep Apnea, Depression, Anxiety"),
                      tags$li("Stroke, Cancer")
                    )),
            tags$li(strong("1 Sex variable (binary, weight = 1.0):"),
                    tags$ul(
                      tags$li("Sex (0=Male, 1=Female)")
                    )),
            tags$li(strong("3 Age categories (one-hot encoded, each weight = 1/√3 ≈ 0.577):"),
                    tags$ul(
                      tags$li("Age <55 (≤55 years)"),
                      tags$li("Age 55-65 (55 < age ≤ 65)"),
                      tags$li("Age >65 (>65 years)")
                    )),
            tags$li(strong("4 BMI categories (one-hot encoded, each weight = 1/√4 = 0.5):"),
                    tags$ul(
                      tags$li("Underweight (BMI < 18.5)"),
                      tags$li("Normal (18.5 ≤ BMI < 25)"),
                      tags$li("Overweight (25 ≤ BMI < 30)"),
                      tags$li("Obesity (BMI ≥ 30)")
                    ))
          ),

          h4("Weighting Rationale:"),
          p("Categorical variables are one-hot encoded and weighted by 1/√(n_categories) to
            prevent them from dominating the distance calculations. This ensures that each
            conceptual variable (age or BMI) contributes equally to the clustering regardless
            of the number of categories."),

          h4("Instructions:"),
          tags$ol(
            tags$li("Adjust SOM grid dimensions using the sidebar sliders"),
            tags$li("Click 'Train/Update SOM' to generate new results"),
            tags$li("Navigate between tabs to explore different visualizations"),
            tags$li("Use the download buttons to export plots")
          )
        )
      )
    )
  )
)

# ============================================================================
# SERVER LOGIC
# ============================================================================

server <- function(input, output, session) {

  # Reactive values
  values <- reactiveValues(
    som_model = NULL,
    som_data = NULL,
    metrics_df = NULL,
    status = "Ready to train SOM"
  )

  # Load and prepare data
  data_prepared <- reactive({
    # Load data
    data <- read.csv("/Users/yinzheqi/Documents/Code/Rcode/Visualization/HIFLO_with_BODE_total_only_cleaned.csv",
                     stringsAsFactors = FALSE)

    # Select comorbidity variables (excluding COPD) and sex
    comorbidity_vars <- c(
      "H009_HBP", "H009_DIAB", "H009_CHF", "H009_CAD",
      "H009_CKD", "H009_ASTHMA", "H009_APNEA",
      "H009_DEP...61", "H009_ANX...60", "H009_CVA", "H009_ANYTUMOR"
    )

    sex_var <- "H005_SEX"

    # Filter out rows with missing Age or BMI
    data_complete <- data %>%
      filter(!is.na(H005_AGE) & !is.na(BMI))

    # Create categorical variables
    data_complete$Age_Category <- categorize_age(data_complete$H005_AGE)
    data_complete$BMI_Category <- categorize_bmi(data_complete$BMI)

    # Prepare comorbidity data
    comorbidity_data <- data_complete[, comorbidity_vars]
    comorbidity_data[] <- lapply(comorbidity_data, as.numeric)
    comorbidity_data[is.na(comorbidity_data)] <- 0

    # Add sex variable (convert from 1/2 to 0/1: 1=Male→0, 2=Female→1)
    sex_data <- data.frame(H005_SEX = as.numeric(data_complete[[sex_var]]) - 1)

    # One-hot encode categorical variables
    age_onehot <- one_hot_encode(data_complete$Age_Category, "Age")
    bmi_onehot <- one_hot_encode(data_complete$BMI_Category, "BMI")

    # Combine all variables (comorbidities, sex, age, BMI)
    som_data_combined <- cbind(comorbidity_data, sex_data, age_onehot, bmi_onehot)

    # Create weighting vector
    # 11 comorbidities with weight 1.0
    # 1 sex variable with weight 1.0
    # 3 age categories with weight 1/sqrt(3)
    # 4 BMI categories with weight 1/sqrt(4)
    n_comorbidity <- ncol(comorbidity_data)
    n_sex <- ncol(sex_data)
    n_age <- ncol(age_onehot)
    n_bmi <- ncol(bmi_onehot)

    weights <- c(
      rep(1.0, n_comorbidity),
      rep(1.0, n_sex),
      rep(1/sqrt(n_age), n_age),
      rep(1/sqrt(n_bmi), n_bmi)
    )

    # Apply weights to data
    som_data_weighted <- sweep(som_data_combined, 2, weights, "*")

    # Scale the weighted data
    som_data_scaled <- scale(som_data_weighted)

    # Store additional information
    fev1_category <- data_complete$FEV1_Category
    bode_total <- data_complete$BODE_total
    age_category <- data_complete$Age_Category
    bmi_category <- data_complete$BMI_Category

    return(list(
      data = som_data_combined,
      data_weighted = som_data_weighted,
      scaled = som_data_scaled,
      weights = weights,
      vars = colnames(som_data_combined),
      comorbidity_vars = comorbidity_vars,
      n_comorbidity = n_comorbidity,
      n_sex = n_sex,
      n_age = n_age,
      n_bmi = n_bmi,
      fev1_category = fev1_category,
      bode_total = bode_total,
      age_category = age_category,
      bmi_category = bmi_category,
      sex_binary = sex_data$H005_SEX,
      full_data = data_complete,
      n_removed = nrow(data) - nrow(data_complete)
    ))
  })

  # Train SOM model
  observeEvent(input$train_som, {

    withProgress(message = 'Training SOM...', value = 0, {

      values$status <- "Training SOM model..."

      # Get prepared data
      data_prep <- data_prepared()

      incProgress(0.1, detail = paste("Removed", data_prep$n_removed, "rows with missing Age/BMI"))

      incProgress(0.2, detail = "Preparing data")

      # Create SOM grid
      som_grid <- somgrid(xdim = input$som_x,
                          ydim = input$som_y,
                          topo = "hexagonal")

      incProgress(0.3, detail = "Creating SOM grid")

      # Set seed RIGHT BEFORE training SOM for reproducibility
      set.seed(123)

      # Train SOM with weighted and scaled data
      som_model <- som(data_prep$scaled,
                       grid = som_grid,
                       rlen = 100,
                       alpha = c(0.05, 0.01),
                       keep.data = TRUE)

      incProgress(0.5, detail = "Training complete")

      # Calculate metrics for different k values
      metrics_list <- list()
      k_values <- 2:10

      for(i in seq_along(k_values)) {
        incProgress(0.5 + (0.4 * i/length(k_values)),
                   detail = paste("Calculating metrics for k =", k_values[i]))

        metrics_list[[i]] <- calculate_all_metrics(k_values[i],
                                                   som_model$codes[[1]],
                                                   data_prep$scaled)
      }

      # Create metrics dataframe
      metrics_df <- data.frame(
        k = k_values,
        silhouette = sapply(metrics_list, function(x) x$silhouette),
        calinski = sapply(metrics_list, function(x) x$calinski),
        davies_bouldin = sapply(metrics_list, function(x) x$davies_bouldin),
        dunn = sapply(metrics_list, function(x) x$dunn)
      )

      # Store results
      values$som_model <- som_model
      values$som_data <- data_prep
      values$metrics_df <- metrics_df
      values$status <- sprintf("SOM trained: %dx%d grid, n=%d (removed %d missing)",
                               input$som_x, input$som_y,
                               nrow(data_prep$data), data_prep$n_removed)

      incProgress(1, detail = "Done!")
    })
  })

  # Status output
  output$status_text <- renderText({
    values$status
  })

  # ============================================================================
  # METRICS TAB OUTPUTS
  # ============================================================================

  # Combined metrics plot
  output$metrics_combined <- renderPlot({
    req(values$metrics_df)

    df <- values$metrics_df

    p1 <- ggplot(df, aes(x = k, y = silhouette)) +
      geom_line(color = "darkblue", linewidth = 1.2) +
      geom_point(color = "darkblue", size = 3) +
      geom_point(data = df[which.max(df$silhouette), ],
                 color = "red", size = 4) +
      scale_x_continuous(breaks = 2:10) +
      labs(title = "Silhouette Coefficient",
           subtitle = "Higher is better",
           x = "Number of Clusters (k)", y = "Score") +
      theme_minimal()

    p2 <- ggplot(df, aes(x = k, y = calinski)) +
      geom_line(color = "darkgreen", linewidth = 1.2) +
      geom_point(color = "darkgreen", size = 3) +
      geom_point(data = df[which.max(df$calinski), ],
                 color = "red", size = 4) +
      scale_x_continuous(breaks = 2:10) +
      labs(title = "Calinski-Harabasz Index",
           subtitle = "Higher is better",
           x = "Number of Clusters (k)", y = "Score") +
      theme_minimal()

    p3 <- ggplot(df, aes(x = k, y = davies_bouldin)) +
      geom_line(color = "darkorange", linewidth = 1.2) +
      geom_point(color = "darkorange", size = 3) +
      geom_point(data = df[which.min(df$davies_bouldin), ],
                 color = "red", size = 4) +
      scale_x_continuous(breaks = 2:10) +
      labs(title = "Davies-Bouldin Index",
           subtitle = "Lower is better",
           x = "Number of Clusters (k)", y = "Score") +
      theme_minimal()

    p4 <- ggplot(df, aes(x = k, y = dunn)) +
      geom_line(color = "purple", linewidth = 1.2) +
      geom_point(color = "purple", size = 3) +
      geom_point(data = df[which.max(df$dunn), ],
                 color = "red", size = 4) +
      scale_x_continuous(breaks = 2:10) +
      labs(title = "Dunn Index",
           subtitle = "Higher is better",
           x = "Number of Clusters (k)", y = "Score") +
      theme_minimal()

    grid.arrange(p1, p2, p3, p4, ncol = 2,
                 top = textGrob(sprintf("Clustering Evaluation Metrics (SOM %dx%d)",
                                      input$som_x, input$som_y),
                               gp = gpar(fontsize = 16, fontface = "bold")))
  })

  # Individual metric plots
  output$silhouette_plot <- renderPlot({
    req(values$metrics_df)
    df <- values$metrics_df

    ggplot(df, aes(x = k, y = silhouette)) +
      geom_line(color = "darkblue", linewidth = 1.5) +
      geom_point(color = "darkblue", size = 4) +
      geom_point(data = df[which.max(df$silhouette), ],
                 color = "red", size = 5) +
      scale_x_continuous(breaks = 2:10) +
      labs(title = "Silhouette Coefficient",
           x = "Number of Clusters", y = "Score") +
      theme_minimal() +
      theme(text = element_text(size = 14))
  })

  output$calinski_plot <- renderPlot({
    req(values$metrics_df)
    df <- values$metrics_df

    ggplot(df, aes(x = k, y = calinski)) +
      geom_line(color = "darkgreen", linewidth = 1.5) +
      geom_point(color = "darkgreen", size = 4) +
      geom_point(data = df[which.max(df$calinski), ],
                 color = "red", size = 5) +
      scale_x_continuous(breaks = 2:10) +
      labs(title = "Calinski-Harabasz Index",
           x = "Number of Clusters", y = "Score") +
      theme_minimal() +
      theme(text = element_text(size = 14))
  })

  output$davies_plot <- renderPlot({
    req(values$metrics_df)
    df <- values$metrics_df

    ggplot(df, aes(x = k, y = davies_bouldin)) +
      geom_line(color = "darkorange", linewidth = 1.5) +
      geom_point(color = "darkorange", size = 4) +
      geom_point(data = df[which.min(df$davies_bouldin), ],
                 color = "red", size = 5) +
      scale_x_continuous(breaks = 2:10) +
      labs(title = "Davies-Bouldin Index",
           x = "Number of Clusters", y = "Score") +
      theme_minimal() +
      theme(text = element_text(size = 14))
  })

  output$dunn_plot <- renderPlot({
    req(values$metrics_df)
    df <- values$metrics_df

    ggplot(df, aes(x = k, y = dunn)) +
      geom_line(color = "purple", linewidth = 1.5) +
      geom_point(color = "purple", size = 4) +
      geom_point(data = df[which.max(df$dunn), ],
                 color = "red", size = 5) +
      scale_x_continuous(breaks = 2:10) +
      labs(title = "Dunn Index",
           x = "Number of Clusters", y = "Score") +
      theme_minimal() +
      theme(text = element_text(size = 14))
  })

  # Metrics table
  output$metrics_table <- DT::renderDataTable({
    req(values$metrics_df)

    df <- values$metrics_df
    df[, 2:5] <- round(df[, 2:5], 4)

    DT::datatable(df,
                  options = list(pageLength = 10, dom = 't'),
                  rownames = FALSE,
                  colnames = c("K", "Silhouette", "Calinski-H", "Davies-B", "Dunn"))
  })

  # Optimal K summary
  output$optimal_k_summary <- renderPrint({
    req(values$metrics_df)

    df <- values$metrics_df

    cat("OPTIMAL NUMBER OF CLUSTERS BY METRIC:\n")
    cat("=====================================\n")
    cat(sprintf("Silhouette (max):     k = %d (score = %.4f)\n",
                df$k[which.max(df$silhouette)], max(df$silhouette, na.rm = TRUE)))
    cat(sprintf("Calinski-H (max):     k = %d (score = %.2f)\n",
                df$k[which.max(df$calinski)], max(df$calinski, na.rm = TRUE)))
    cat(sprintf("Davies-Bouldin (min): k = %d (score = %.4f)\n",
                df$k[which.min(df$davies_bouldin)], min(df$davies_bouldin, na.rm = TRUE)))
    cat(sprintf("Dunn Index (max):     k = %d (score = %.4f)\n",
                df$k[which.max(df$dunn)], max(df$dunn, na.rm = TRUE)))
  })

  # ============================================================================
  # VISUALIZATION TAB OUTPUTS
  # ============================================================================

  # Get grid data with counts and clusters
  grid_data <- reactive({
    req(values$som_model)

    # Extract grid coordinates
    grid_pts <- values$som_model$grid$pts
    colnames(grid_pts) <- c("x", "y")

    # Map samples to nodes and count
    winning_nodes <- values$som_model$unit.classif
    node_counts <- table(winning_nodes)

    # Create count dataframe
    count_df <- data.frame(
      node_id = as.integer(names(node_counts)),
      count = as.integer(node_counts)
    )

    # Merge with grid
    grid_with_counts <- data.frame(
      node_id = 1:nrow(grid_pts),
      x = grid_pts[,1],
      y = grid_pts[,2]
    ) %>%
      left_join(count_df, by = "node_id") %>%
      mutate(count = ifelse(is.na(count), 0, count))

    # Add clusters
    som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
    grid_with_counts$cluster <- som_cluster

    return(grid_with_counts)
  })

  # Hexagonal counts plot
  output$hex_counts <- renderPlot({
    req(grid_data())

    ggplot(grid_data(), aes(x = x, y = y)) +
      geom_hex(aes(fill = count), stat = "identity", color = "white") +
      scale_fill_gradient(low = "lightblue", high = "darkred",
                          name = "Sample\nCount") +
      coord_equal() +
      theme_minimal() +
      labs(title = sprintf("SOM Grid (%dx%d) - Sample Distribution",
                          input$som_x, input$som_y),
           x = "Grid X", y = "Grid Y") +
      theme(plot.title = element_text(size = 14, face = "bold"))
  })

  # Hexagonal clusters plot
  output$hex_clusters <- renderPlot({
    req(grid_data())

    ggplot(grid_data(), aes(x = x, y = y)) +
      geom_hex(aes(fill = factor(cluster)), stat = "identity", color = "white") +
      scale_fill_brewer(palette = "Set1", name = "Cluster") +
      coord_equal() +
      theme_minimal() +
      labs(title = sprintf("%d Clusters via Hierarchical Clustering", input$n_clusters),
           x = "Grid X", y = "Grid Y") +
      theme(plot.title = element_text(size = 14, face = "bold"))
  })

  # U-Matrix
  output$umatrix <- renderPlot({
    req(values$som_model)

    # Calculate mean distances
    n_units <- nrow(values$som_model$codes[[1]])
    mean_distances <- numeric(n_units)

    for (i in 1:n_units) {
      unit_dists <- as.matrix(dist(values$som_model$codes[[1]]))
      dists_to_unit <- unit_dists[i, ]
      neighbors <- which(dists_to_unit > 0 & dists_to_unit < 2)
      if (length(neighbors) > 0) {
        mean_distances[i] <- mean(dists_to_unit[neighbors])
      } else {
        mean_distances[i] <- 0
      }
    }

    grid_with_distances <- grid_data() %>%
      mutate(distance = mean_distances)

    ggplot(grid_with_distances, aes(x = x, y = y)) +
      geom_hex(aes(fill = distance), stat = "identity", color = "white") +
      scale_fill_viridis(name = "Mean\nDistance") +
      coord_equal() +
      theme_minimal() +
      labs(title = "U-Matrix - Node Distances",
           subtitle = "Darker regions indicate cluster boundaries",
           x = "Grid X", y = "Grid Y") +
      theme(plot.title = element_text(size = 14, face = "bold"))
  })

  # Component planes
  output$component_planes <- renderPlot({
    req(values$som_model, values$som_data)

    # Nice labels for all variables
    nice_labels <- c(
      # Comorbidities
      "H009_HBP" = "Hypertension",
      "H009_DIAB" = "Diabetes",
      "H009_CHF" = "Heart Failure",
      "H009_CAD" = "CAD",
      "H009_CKD" = "CKD",
      "H009_ASTHMA" = "Asthma",
      "H009_APNEA" = "Sleep Apnea",
      "H009_DEP...61" = "Depression",
      "H009_ANX...60" = "Anxiety",
      "H009_CVA" = "Stroke",
      "H009_ANYTUMOR" = "Cancer",
      # Sex
      "H005_SEX" = "Female",
      # Age categories
      "Age_<55" = "Age <55",
      "Age_55-65" = "Age 55-65",
      "Age_>65" = "Age >65",
      # BMI categories
      "BMI_Normal" = "BMI: Normal",
      "BMI_Obesity" = "BMI: Obesity",
      "BMI_Overweight" = "BMI: Overweight",
      "BMI_Underweight" = "BMI: Underweight"
    )

    # Create all component data
    all_components_data <- data.frame()

    for (i in 1:length(values$som_data$vars)) {
      var_name <- values$som_data$vars[i]
      var_codes <- values$som_model$codes[[1]][, i]

      # Get nice label or use original name
      display_name <- ifelse(var_name %in% names(nice_labels),
                            nice_labels[var_name],
                            var_name)

      temp_df <- grid_data() %>%
        mutate(component = var_codes,
               variable = display_name)

      all_components_data <- rbind(all_components_data, temp_df)
    }

    # Reorder factors for better display
    all_components_data$variable <- factor(all_components_data$variable,
                                          levels = nice_labels)

    ggplot(all_components_data, aes(x = x, y = y)) +
      geom_hex(aes(fill = component), stat = "identity", color = "white", linewidth = 0.2) +
      scale_fill_gradient2(low = "blue", mid = "white", high = "red",
                          midpoint = 0, name = "SOM\nWeight") +
      facet_wrap(~ variable, ncol = 4) +
      coord_equal() +
      theme_minimal() +
      labs(title = "SOM Component Planes - All Variables",
           subtitle = "Blue = low weight, Red = high weight",
           x = "Grid X", y = "Grid Y") +
      theme(plot.title = element_text(size = 14, face = "bold"),
            strip.text = element_text(size = 9, face = "bold"),
            axis.text = element_blank(),
            axis.ticks = element_blank())
  })

  # Cluster heatmap
  output$cluster_heatmap <- renderPlot({
    req(values$som_model, values$som_data)

    # Get cluster assignments
    som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
    unit_assignments <- values$som_model$unit.classif[1:nrow(values$som_data$data)]
    cluster_assignments <- som_cluster[unit_assignments]

    # Add to data
    data_with_clusters <- values$som_data$data
    data_with_clusters$SOM_Cluster <- cluster_assignments

    # Calculate comorbidity and sex summary
    vars_to_summarize <- c(values$som_data$comorbidity_vars, "H005_SEX")
    comorbidity_summary <- data_with_clusters[, c("SOM_Cluster", vars_to_summarize)] %>%
      group_by(SOM_Cluster) %>%
      summarise(across(everything(), ~mean(.x) * 100), .groups = 'drop')

    # Prepare for heatmap
    heatmap_data <- comorbidity_summary %>%
      pivot_longer(cols = -SOM_Cluster,
                   names_to = "Comorbidity",
                   values_to = "Prevalence") %>%
      mutate(Comorbidity = recode(Comorbidity,
                                   "H009_HBP" = "Hypertension",
                                   "H009_DIAB" = "Diabetes",
                                   "H009_CHF" = "Heart Failure",
                                   "H009_CAD" = "CAD",
                                   "H009_CKD" = "CKD",
                                   "H009_ASTHMA" = "Asthma",
                                   "H009_APNEA" = "Sleep Apnea",
                                   "H009_DEP...61" = "Depression",
                                   "H009_ANX...60" = "Anxiety",
                                   "H009_CVA" = "Stroke",
                                   "H009_ANYTUMOR" = "Cancer",
                                   "H005_SEX" = "Female"))

    ggplot(heatmap_data, aes(x = Comorbidity, y = factor(SOM_Cluster))) +
      geom_tile(aes(fill = Prevalence), color = "white") +
      scale_fill_gradient2(low = "blue", mid = "white", high = "red",
                          midpoint = 50, name = "Prevalence\n(%)") +
      theme_minimal() +
      labs(title = "Comorbidity Prevalence by Cluster",
           x = "Comorbidity", y = "Cluster") +
      theme(plot.title = element_text(size = 14, face = "bold"),
            axis.text.x = element_text(angle = 45, hjust = 1))
  })

  # Cluster summary table
  output$cluster_summary <- DT::renderDataTable({
    req(values$som_model, values$som_data)

    # Get cluster assignments
    som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
    unit_assignments <- values$som_model$unit.classif[1:nrow(values$som_data$data)]
    cluster_assignments <- som_cluster[unit_assignments]

    # Prepare data with clusters and original categories
    data_with_info <- values$som_data$data
    data_with_info$SOM_Cluster <- cluster_assignments
    data_with_info$Age_Category <- values$som_data$age_category
    data_with_info$BMI_Category <- values$som_data$bmi_category

    # Calculate summary
    cluster_summary <- data_with_info %>%
      group_by(SOM_Cluster) %>%
      summarise(
        n = n(),
        `% of Total` = round(n() / nrow(data_with_info) * 100, 1),
        `HTN %` = round(mean(H009_HBP) * 100, 1),
        `DM %` = round(mean(H009_DIAB) * 100, 1),
        `CHF %` = round(mean(H009_CHF) * 100, 1),
        `CAD %` = round(mean(H009_CAD) * 100, 1),
        `CKD %` = round(mean(H009_CKD) * 100, 1),
        `Asthma %` = round(mean(H009_ASTHMA) * 100, 1),
        `Female %` = round(mean(H005_SEX) * 100, 1),
        `Age <55 %` = round(mean(Age_Category == "<55") * 100, 1),
        `Age 55-65 %` = round(mean(Age_Category == "55-65") * 100, 1),
        `Age >65 %` = round(mean(Age_Category == ">65") * 100, 1),
        `BMI Normal %` = round(mean(BMI_Category == "Normal") * 100, 1),
        `BMI Obesity %` = round(mean(BMI_Category == "Obesity") * 100, 1),
        `BMI Overweight %` = round(mean(BMI_Category == "Overweight") * 100, 1)
      )

    DT::datatable(cluster_summary,
                  options = list(pageLength = 10, scrollX = TRUE),
                  rownames = FALSE)
  })

  # Age distribution plot
  output$age_distribution <- renderPlot({
    req(values$som_model, values$som_data)

    # Get cluster assignments
    som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
    unit_assignments <- values$som_model$unit.classif[1:nrow(values$som_data$data)]
    cluster_assignments <- som_cluster[unit_assignments]

    # Get age categories
    age_data <- data.frame(
      SOM_Cluster = cluster_assignments,
      Age_Category = values$som_data$age_category
    )

    # Calculate proportions
    age_summary <- age_data %>%
      group_by(SOM_Cluster, Age_Category) %>%
      summarise(count = n(), .groups = 'drop') %>%
      group_by(SOM_Cluster) %>%
      mutate(proportion = count / sum(count) * 100)

    # Define age order
    age_order <- c("<55", "55-65", ">65")
    age_summary$Age_Category <- factor(age_summary$Age_Category, levels = age_order)

    # Create stacked bar chart
    ggplot(age_summary, aes(x = factor(SOM_Cluster), y = proportion, fill = Age_Category)) +
      geom_bar(stat = "identity", position = "stack") +
      scale_fill_manual(values = c("<55" = "#4daf4a",
                                   "55-65" = "#ff7f00",
                                   ">65" = "#e41a1c"),
                        name = "Age Category") +
      labs(title = sprintf("Age Category Distribution Across %d Clusters", input$n_clusters),
           x = "Cluster",
           y = "Percentage (%)") +
      theme_minimal() +
      theme(plot.title = element_text(size = 14, face = "bold")) +
      scale_y_continuous(expand = c(0, 0), limits = c(0, 100))
  })

  # BMI distribution plot
  output$bmi_distribution <- renderPlot({
    req(values$som_model, values$som_data)

    # Get cluster assignments
    som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
    unit_assignments <- values$som_model$unit.classif[1:nrow(values$som_data$data)]
    cluster_assignments <- som_cluster[unit_assignments]

    # Get BMI categories
    bmi_data <- data.frame(
      SOM_Cluster = cluster_assignments,
      BMI_Category = values$som_data$bmi_category
    )

    # Calculate proportions
    bmi_summary <- bmi_data %>%
      group_by(SOM_Cluster, BMI_Category) %>%
      summarise(count = n(), .groups = 'drop') %>%
      group_by(SOM_Cluster) %>%
      mutate(proportion = count / sum(count) * 100)

    # Define BMI order
    bmi_order <- c("Underweight", "Normal", "Overweight", "Obesity")
    bmi_summary$BMI_Category <- factor(bmi_summary$BMI_Category, levels = bmi_order)

    # Create stacked bar chart
    ggplot(bmi_summary, aes(x = factor(SOM_Cluster), y = proportion, fill = BMI_Category)) +
      geom_bar(stat = "identity", position = "stack") +
      scale_fill_manual(values = c("Underweight" = "#2166ac",
                                   "Normal" = "#4daf4a",
                                   "Overweight" = "#ff7f00",
                                   "Obesity" = "#e41a1c"),
                        name = "BMI Category") +
      labs(title = sprintf("BMI Category Distribution Across %d Clusters", input$n_clusters),
           x = "Cluster",
           y = "Percentage (%)") +
      theme_minimal() +
      theme(plot.title = element_text(size = 14, face = "bold")) +
      scale_y_continuous(expand = c(0, 0), limits = c(0, 100))
  })

  # BODE Score Analysis - Box Plot
  output$bode_boxplot <- renderPlot({
    req(values$som_model, values$som_data)

    # Get cluster assignments
    som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
    unit_assignments <- values$som_model$unit.classif[1:nrow(values$som_data$data)]
    cluster_assignments <- som_cluster[unit_assignments]

    # Get BODE scores
    bode_data <- data.frame(
      SOM_Cluster = factor(cluster_assignments),
      BODE_total = values$som_data$bode_total[1:nrow(values$som_data$data)]
    )

    # Remove any NA values
    bode_data <- bode_data[!is.na(bode_data$BODE_total), ]

    # Create box plot
    ggplot(bode_data, aes(x = SOM_Cluster, y = BODE_total, fill = SOM_Cluster)) +
      geom_boxplot(alpha = 0.8, outlier.shape = 21, outlier.size = 2) +
      geom_jitter(width = 0.15, alpha = 0.3, size = 1) +
      scale_fill_brewer(palette = "Set1", name = "Cluster") +
      labs(title = sprintf("BODE Score Distribution Across %d Clusters", input$n_clusters),
           x = "Cluster",
           y = "BODE Score (0-10)") +
      theme_minimal() +
      theme(plot.title = element_text(size = 14, face = "bold"),
            legend.position = "none") +
      scale_y_continuous(breaks = seq(0, 10, 2), limits = c(-0.5, 10.5)) +
      geom_hline(yintercept = c(3, 6, 8), linetype = "dashed", alpha = 0.3, color = "gray")
  })


  # BODE Score Summary Statistics Table
  output$bode_summary_table <- DT::renderDataTable({
    req(values$som_model, values$som_data)

    # Get cluster assignments
    som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
    unit_assignments <- values$som_model$unit.classif[1:nrow(values$som_data$data)]
    cluster_assignments <- som_cluster[unit_assignments]

    # Get BODE scores
    bode_data <- data.frame(
      SOM_Cluster = cluster_assignments,
      BODE_total = values$som_data$bode_total[1:nrow(values$som_data$data)]
    )

    # Remove any NA values
    bode_data <- bode_data[!is.na(bode_data$BODE_total), ]

    # Calculate summary statistics
    bode_summary <- bode_data %>%
      group_by(SOM_Cluster) %>%
      summarise(
        N = n(),
        Mean = round(mean(BODE_total), 2),
        SD = round(sd(BODE_total), 2),
        Median = round(median(BODE_total), 2),
        IQR = round(IQR(BODE_total), 2),
        Min = min(BODE_total),
        Max = max(BODE_total),
        .groups = 'drop'
      )

    DT::datatable(bode_summary,
                  options = list(pageLength = 10, scrollX = FALSE),
                  rownames = FALSE,
                  caption = "BODE Score Summary Statistics by Cluster")
  })

  # FEV1 Distribution plot
  output$fev1_distribution <- renderPlot({
    req(values$som_model, values$som_data)

    # Get cluster assignments
    som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
    unit_assignments <- values$som_model$unit.classif[1:nrow(values$som_data$data)]
    cluster_assignments <- som_cluster[unit_assignments]

    # Get FEV1 categories
    fev1_data <- data.frame(
      SOM_Cluster = cluster_assignments,
      FEV1_Category = values$som_data$fev1_category[1:nrow(values$som_data$data)]
    )

    # Remove any NA values
    fev1_data <- fev1_data[!is.na(fev1_data$FEV1_Category), ]

    # Calculate proportions for stacked bar chart
    fev1_summary <- fev1_data %>%
      group_by(SOM_Cluster, FEV1_Category) %>%
      summarise(count = n(), .groups = 'drop') %>%
      group_by(SOM_Cluster) %>%
      mutate(proportion = count / sum(count) * 100)

    # Define GOLD order
    gold_order <- c("Mild (GOLD I)", "Moderate (GOLD II)",
                    "Severe (GOLD III)", "Very severe (GOLD IV)")
    fev1_summary$FEV1_Category <- factor(fev1_summary$FEV1_Category, levels = gold_order)

    # Create stacked bar chart
    ggplot(fev1_summary, aes(x = factor(SOM_Cluster), y = proportion, fill = FEV1_Category)) +
      geom_bar(stat = "identity", position = "stack") +
      scale_fill_manual(values = c("Mild (GOLD I)" = "#2166ac",
                                   "Moderate (GOLD II)" = "#67a9cf",
                                   "Severe (GOLD III)" = "#f4a582",
                                   "Very severe (GOLD IV)" = "#b2182b"),
                        name = "FEV1 Category") +
      labs(title = sprintf("FEV1 Category Distribution Across %d Clusters", input$n_clusters),
           x = "Cluster",
           y = "Percentage (%)") +
      theme_minimal() +
      theme(plot.title = element_text(size = 14, face = "bold"),
            legend.position = "right") +
      scale_y_continuous(expand = c(0, 0), limits = c(0, 100))
  })

  # FEV1 Summary table
  output$fev1_summary <- DT::renderDataTable({
    req(values$som_model, values$som_data)

    # Get cluster assignments
    som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
    unit_assignments <- values$som_model$unit.classif[1:nrow(values$som_data$data)]
    cluster_assignments <- som_cluster[unit_assignments]

    # Get FEV1 categories
    fev1_data <- data.frame(
      SOM_Cluster = cluster_assignments,
      FEV1_Category = values$som_data$fev1_category[1:nrow(values$som_data$data)]
    )

    # Remove any NA values
    fev1_data <- fev1_data[!is.na(fev1_data$FEV1_Category), ]

    # Calculate detailed summary
    fev1_detailed <- fev1_data %>%
      group_by(SOM_Cluster) %>%
      summarise(
        n = n(),
        `Mild (GOLD I) n` = sum(FEV1_Category == "Mild (GOLD I)"),
        `Mild (GOLD I) %` = round(mean(FEV1_Category == "Mild (GOLD I)") * 100, 1),
        `Moderate (GOLD II) n` = sum(FEV1_Category == "Moderate (GOLD II)"),
        `Moderate (GOLD II) %` = round(mean(FEV1_Category == "Moderate (GOLD II)") * 100, 1),
        `Severe (GOLD III) n` = sum(FEV1_Category == "Severe (GOLD III)"),
        `Severe (GOLD III) %` = round(mean(FEV1_Category == "Severe (GOLD III)") * 100, 1),
        `Very severe (GOLD IV) n` = sum(FEV1_Category == "Very severe (GOLD IV)"),
        `Very severe (GOLD IV) %` = round(mean(FEV1_Category == "Very severe (GOLD IV)") * 100, 1),
        .groups = 'drop'
      )

    DT::datatable(fev1_detailed,
                  options = list(pageLength = 10, scrollX = TRUE),
                  rownames = FALSE,
                  caption = "FEV1 Category Distribution by Cluster (n = count, % = percentage)")
  })

  # ============================================================================
  # CLUSTER VALIDATION TAB OUTPUTS
  # ============================================================================

  # Calculate chi-square test results for all clusters vs population
  validation_results <- reactive({
    req(values$som_model, values$som_data)

    # Get cluster assignments
    som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
    unit_assignments <- values$som_model$unit.classif[1:nrow(values$som_data$data)]
    cluster_assignments <- som_cluster[unit_assignments]

    # Variables to test (comorbidities + sex)
    vars_to_test <- c(values$som_data$comorbidity_vars, "H005_SEX")
    var_labels <- c(
      "Hypertension", "Diabetes", "Heart Failure", "CAD", "CKD",
      "Asthma", "Sleep Apnea", "Depression", "Anxiety", "Stroke", "Cancer", "Female"
    )

    # Population prevalence
    pop_prevalence <- colMeans(values$som_data$data[, vars_to_test]) * 100
    pop_n <- nrow(values$som_data$data)

    # Results storage
    all_results <- list()

    # For each cluster
    for (k in sort(unique(cluster_assignments))) {
      cluster_mask <- cluster_assignments == k
      cluster_data <- values$som_data$data[cluster_mask, vars_to_test]
      cluster_n <- sum(cluster_mask)

      cluster_results <- data.frame(
        Cluster = k,
        Variable = var_labels,
        Cluster_n = cluster_n,
        Cluster_Prevalence = colMeans(cluster_data) * 100,
        Population_Prevalence = pop_prevalence,
        Difference = (colMeans(cluster_data) * 100) - pop_prevalence,
        Chi_Square = NA,
        P_Value = NA,
        Cramers_V = NA,
        Significance = "",
        stringsAsFactors = FALSE
      )

      # Chi-square test for each variable
      for (i in 1:length(vars_to_test)) {
        # Create 2x2 contingency table
        cluster_present <- sum(cluster_data[, i] == 1)
        cluster_absent <- cluster_n - cluster_present
        pop_present <- sum(values$som_data$data[, vars_to_test[i]] == 1) - cluster_present
        pop_absent <- (pop_n - cluster_n) - pop_present

        cont_table <- matrix(c(cluster_present, cluster_absent,
                               pop_present, pop_absent),
                             nrow = 2, byrow = TRUE)

        # Chi-square test
        chi_test <- tryCatch({
          chisq.test(cont_table, correct = FALSE)
        }, error = function(e) NULL)

        if (!is.null(chi_test)) {
          cluster_results$Chi_Square[i] <- chi_test$statistic
          cluster_results$P_Value[i] <- chi_test$p.value

          # Cramér's V effect size
          cramers_v <- sqrt(chi_test$statistic / (pop_n * (min(2, 2) - 1)))
          cluster_results$Cramers_V[i] <- cramers_v

          # Significance stars
          if (chi_test$p.value < 0.001) {
            cluster_results$Significance[i] <- "***"
          } else if (chi_test$p.value < 0.01) {
            cluster_results$Significance[i] <- "**"
          } else if (chi_test$p.value < 0.05) {
            cluster_results$Significance[i] <- "*"
          } else {
            cluster_results$Significance[i] <- "ns"
          }
        }
      }

      all_results[[k]] <- cluster_results
    }

    # Combine all results
    results_df <- do.call(rbind, all_results)
    return(results_df)
  })

  # Calculate Fisher's exact test results for all clusters vs population
  fisher_validation_results <- reactive({
    req(values$som_model, values$som_data)

    # Get cluster assignments
    som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
    unit_assignments <- values$som_model$unit.classif[1:nrow(values$som_data$data)]
    cluster_assignments <- som_cluster[unit_assignments]

    # Variables to test (comorbidities + sex)
    vars_to_test <- c(values$som_data$comorbidity_vars, "H005_SEX")
    var_labels <- c(
      "Hypertension", "Diabetes", "Heart Failure", "CAD", "CKD",
      "Asthma", "Sleep Apnea", "Depression", "Anxiety", "Stroke", "Cancer", "Female"
    )

    # Population prevalence
    pop_prevalence <- colMeans(values$som_data$data[, vars_to_test]) * 100
    pop_n <- nrow(values$som_data$data)

    # Results storage
    all_results <- list()

    # For each cluster
    for (k in sort(unique(cluster_assignments))) {
      cluster_mask <- cluster_assignments == k
      cluster_data <- values$som_data$data[cluster_mask, vars_to_test]
      cluster_n <- sum(cluster_mask)

      cluster_results <- data.frame(
        Cluster = k,
        Variable = var_labels,
        Cluster_n = cluster_n,
        Cluster_Prevalence = colMeans(cluster_data) * 100,
        Population_Prevalence = pop_prevalence,
        Difference = (colMeans(cluster_data) * 100) - pop_prevalence,
        Odds_Ratio = NA,
        P_Value = NA,
        Significance = "",
        stringsAsFactors = FALSE
      )

      # Fisher's exact test for each variable
      for (i in 1:length(vars_to_test)) {
        # Create 2x2 contingency table
        cluster_present <- sum(cluster_data[, i] == 1)
        cluster_absent <- cluster_n - cluster_present
        pop_present <- sum(values$som_data$data[, vars_to_test[i]] == 1) - cluster_present
        pop_absent <- (pop_n - cluster_n) - pop_present

        cont_table <- matrix(c(cluster_present, cluster_absent,
                               pop_present, pop_absent),
                             nrow = 2, byrow = TRUE)

        # Fisher's exact test
        fisher_test <- tryCatch({
          fisher.test(cont_table)
        }, error = function(e) NULL)

        if (!is.null(fisher_test)) {
          cluster_results$Odds_Ratio[i] <- fisher_test$estimate
          cluster_results$P_Value[i] <- fisher_test$p.value

          # Significance stars
          if (fisher_test$p.value < 0.001) {
            cluster_results$Significance[i] <- "***"
          } else if (fisher_test$p.value < 0.01) {
            cluster_results$Significance[i] <- "**"
          } else if (fisher_test$p.value < 0.05) {
            cluster_results$Significance[i] <- "*"
          } else {
            cluster_results$Significance[i] <- "ns"
          }
        }
      }

      all_results[[k]] <- cluster_results
    }

    # Combine all results
    results_df <- do.call(rbind, all_results)
    return(results_df)
  })

  # Validation heatmap
  output$validation_heatmap <- renderPlot({
    req(validation_results())

    results <- validation_results()

    # Create significance category for coloring
    results$sig_direction <- ifelse(results$P_Value >= 0.05, 0,
                                    ifelse(results$Difference > 0, 1, -1))

    # Create plot
    ggplot(results, aes(x = Variable, y = factor(Cluster))) +
      geom_tile(aes(fill = Difference), color = "white", size = 0.5) +
      geom_text(aes(label = ifelse(Significance != "ns", Significance, "")),
                size = 5, fontface = "bold") +
      scale_fill_gradient2(low = "#2166ac", mid = "white", high = "#b2182b",
                          midpoint = 0,
                          limits = c(-max(abs(results$Difference)), max(abs(results$Difference))),
                          name = "Difference from\nPopulation (%)") +
      labs(title = "Cluster Validation: Deviation from Population Prevalence",
           subtitle = "Chi-square tests with significance markers (*, **, ***)",
           x = "Comorbidity / Variable",
           y = "Cluster") +
      theme_minimal() +
      theme(axis.text.x = element_text(angle = 45, hjust = 1, size = 11),
            axis.text.y = element_text(size = 11),
            plot.title = element_text(size = 14, face = "bold"),
            plot.subtitle = element_text(size = 11))
  })

  # Validation deviation plot
  output$validation_deviation <- renderPlot({
    req(validation_results())

    results <- validation_results()

    # Add significance coloring and labels
    results$is_significant <- results$P_Value < 0.05
    results$Cluster_Label <- paste("Cluster", results$Cluster)

    # Reorder variables by average absolute deviation for better visualization
    var_order <- results %>%
      group_by(Variable) %>%
      summarise(avg_abs_diff = mean(abs(Difference))) %>%
      arrange(desc(avg_abs_diff)) %>%
      pull(Variable)

    results$Variable <- factor(results$Variable, levels = var_order)

    # Calculate dynamic height based on number of clusters
    ncol_val <- ifelse(input$n_clusters <= 3, input$n_clusters, 3)

    ggplot(results, aes(x = Variable, y = Difference, fill = is_significant)) +
      geom_hline(yintercept = 0, linetype = "dashed", color = "gray40", linewidth = 0.8) +
      geom_bar(stat = "identity", width = 0.7) +
      facet_wrap(~ Cluster_Label, ncol = ncol_val, scales = "free_y") +
      scale_fill_manual(values = c("FALSE" = "gray70", "TRUE" = "#d95f02"),
                       name = "Significant",
                       labels = c("No (p ≥ 0.05)", "Yes (p < 0.05)")) +
      labs(title = "Deviation from Population Mean by Cluster",
           subtitle = "Percentage point difference; orange bars = significant (p < 0.05). Variables ordered by average deviation.",
           x = "",
           y = "Difference from Population (percentage points)") +
      theme_minimal() +
      theme(axis.text.x = element_text(angle = 45, hjust = 1, size = 10),
            axis.text.y = element_text(size = 10),
            strip.text = element_text(face = "bold", size = 12),
            strip.background = element_rect(fill = "gray90", color = NA),
            plot.title = element_text(size = 14, face = "bold"),
            plot.subtitle = element_text(size = 10),
            panel.spacing = unit(1, "lines"))
  })

  # Validation table
  output$validation_table <- DT::renderDataTable({
    req(validation_results())

    results <- validation_results()

    # Format for display
    results_display <- results %>%
      mutate(
        Cluster_Prevalence = round(Cluster_Prevalence, 1),
        Population_Prevalence = round(Population_Prevalence, 1),
        Difference = round(Difference, 1),
        Chi_Square = round(Chi_Square, 2),
        P_Value = format.pval(P_Value, digits = 3, eps = 0.001),
        Cramers_V = round(Cramers_V, 3)
      ) %>%
      select(Cluster, Variable, Cluster_n, Cluster_Prevalence, Population_Prevalence,
             Difference, Chi_Square, P_Value, Cramers_V, Significance)

    DT::datatable(results_display,
                  options = list(pageLength = 20, scrollX = TRUE, scrollY = "400px"),
                  rownames = FALSE,
                  colnames = c("Cluster", "Variable", "n", "Cluster (%)", "Population (%)",
                              "Diff (%pt)", "χ²", "p-value", "Cramér's V", "Sig"),
                  caption = "Chi-square test results comparing each cluster to whole population") %>%
      DT::formatStyle('Significance',
                      target = 'row',
                      backgroundColor = DT::styleEqual(c("***", "**", "*", "ns"),
                                                      c("#fee0d2", "#fcbba1", "#fc9272", "white")))
  })

  # Fisher's exact test heatmap
  output$fisher_validation_heatmap <- renderPlot({
    req(fisher_validation_results())

    results <- fisher_validation_results()

    # Create significance category for coloring
    results$sig_direction <- ifelse(results$P_Value >= 0.05, 0,
                                    ifelse(results$Difference > 0, 1, -1))

    # Create plot
    ggplot(results, aes(x = Variable, y = factor(Cluster))) +
      geom_tile(aes(fill = Difference), color = "white", size = 0.5) +
      geom_text(aes(label = ifelse(Significance != "ns", Significance, "")),
                size = 5, fontface = "bold") +
      scale_fill_gradient2(low = "#2166ac", mid = "white", high = "#b2182b",
                          midpoint = 0,
                          limits = c(-max(abs(results$Difference)), max(abs(results$Difference))),
                          name = "Difference from\nPopulation (%)") +
      labs(title = "Cluster Validation: Deviation from Population Prevalence (Fisher's Exact Test)",
           subtitle = "Significance markers (*, **, ***)",
           x = "Comorbidity / Variable",
           y = "Cluster") +
      theme_minimal() +
      theme(axis.text.x = element_text(angle = 45, hjust = 1, size = 11),
            axis.text.y = element_text(size = 11),
            plot.title = element_text(size = 14, face = "bold"),
            plot.subtitle = element_text(size = 11))
  })

  # Fisher's exact test deviation plot
  output$fisher_validation_deviation <- renderPlot({
    req(fisher_validation_results())

    results <- fisher_validation_results()

    # Add significance coloring and labels
    results$is_significant <- results$P_Value < 0.05
    results$Cluster_Label <- paste("Cluster", results$Cluster)

    # Reorder variables by average absolute deviation for better visualization
    var_order <- results %>%
      group_by(Variable) %>%
      summarise(avg_abs_diff = mean(abs(Difference))) %>%
      arrange(desc(avg_abs_diff)) %>%
      pull(Variable)

    results$Variable <- factor(results$Variable, levels = var_order)

    # Calculate dynamic height based on number of clusters
    ncol_val <- ifelse(input$n_clusters <= 3, input$n_clusters, 3)

    ggplot(results, aes(x = Variable, y = Difference, fill = is_significant)) +
      geom_hline(yintercept = 0, linetype = "dashed", color = "gray40", linewidth = 0.8) +
      geom_bar(stat = "identity", width = 0.7) +
      facet_wrap(~ Cluster_Label, ncol = ncol_val, scales = "free_y") +
      scale_fill_manual(values = c("FALSE" = "gray70", "TRUE" = "#1b9e77"),
                       name = "Significant",
                       labels = c("No (p ≥ 0.05)", "Yes (p < 0.05)")) +
      labs(title = "Deviation from Population Mean by Cluster (Fisher's Exact Test)",
           subtitle = "Percentage point difference; green bars = significant (p < 0.05). Variables ordered by average deviation.",
           x = "",
           y = "Difference from Population (percentage points)") +
      theme_minimal() +
      theme(axis.text.x = element_text(angle = 45, hjust = 1, size = 10),
            axis.text.y = element_text(size = 10),
            strip.text = element_text(face = "bold", size = 12),
            strip.background = element_rect(fill = "gray90", color = NA),
            plot.title = element_text(size = 14, face = "bold"),
            plot.subtitle = element_text(size = 10),
            panel.spacing = unit(1, "lines"))
  })

  # Fisher's exact test table
  output$fisher_validation_table <- DT::renderDataTable({
    req(fisher_validation_results())

    results <- fisher_validation_results()

    # Format for display
    results_display <- results %>%
      mutate(
        Cluster_Prevalence = round(Cluster_Prevalence, 1),
        Population_Prevalence = round(Population_Prevalence, 1),
        Difference = round(Difference, 1),
        Odds_Ratio = round(Odds_Ratio, 3),
        P_Value = format.pval(P_Value, digits = 3, eps = 0.001)
      ) %>%
      select(Cluster, Variable, Cluster_n, Cluster_Prevalence, Population_Prevalence,
             Difference, Odds_Ratio, P_Value, Significance)

    DT::datatable(results_display,
                  options = list(pageLength = 20, scrollX = TRUE, scrollY = "400px"),
                  rownames = FALSE,
                  colnames = c("Cluster", "Variable", "n", "Cluster (%)", "Population (%)",
                              "Diff (%pt)", "Odds Ratio", "p-value", "Sig"),
                  caption = "Fisher's exact test results comparing each cluster to whole population") %>%
      DT::formatStyle('Significance',
                      target = 'row',
                      backgroundColor = DT::styleEqual(c("***", "**", "*", "ns"),
                                                      c("#d1eeea", "#a8dbd9", "#85c4c9", "white")))
  })

  # ============================================================================
  # DOWNLOAD HANDLERS
  # ============================================================================

  output$download_counts <- downloadHandler(
    filename = function() {
      paste0("som_counts_with_categories_", input$som_x, "x", input$som_y, "_", Sys.Date(), ".pdf")
    },
    content = function(file) {
      pdf(file, width = 10, height = 8)

      p <- ggplot(grid_data(), aes(x = x, y = y)) +
        geom_hex(aes(fill = count), stat = "identity", color = "white") +
        scale_fill_gradient(low = "lightblue", high = "darkred",
                            name = "Sample\nCount") +
        coord_equal() +
        theme_minimal() +
        labs(title = sprintf("SOM Grid (%dx%d) - Sample Distribution",
                            input$som_x, input$som_y),
             x = "Grid X", y = "Grid Y")

      print(p)
      dev.off()
    }
  )

  output$download_clusters <- downloadHandler(
    filename = function() {
      paste0("som_clusters_with_categories_k", input$n_clusters, "_", Sys.Date(), ".pdf")
    },
    content = function(file) {
      pdf(file, width = 10, height = 8)

      p <- ggplot(grid_data(), aes(x = x, y = y)) +
        geom_hex(aes(fill = factor(cluster)), stat = "identity", color = "white") +
        scale_fill_brewer(palette = "Set1", name = "Cluster") +
        coord_equal() +
        theme_minimal() +
        labs(title = sprintf("%d Clusters via Hierarchical Clustering", input$n_clusters),
             x = "Grid X", y = "Grid Y")

      print(p)
      dev.off()
    }
  )

  output$download_age_bmi <- downloadHandler(
    filename = function() {
      paste0("age_bmi_distribution_k", input$n_clusters, "_", Sys.Date(), ".pdf")
    },
    content = function(file) {
      pdf(file, width = 12, height = 10)

      # Get cluster assignments
      som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
      unit_assignments <- values$som_model$unit.classif[1:nrow(values$som_data$data)]
      cluster_assignments <- som_cluster[unit_assignments]

      # Age plot
      age_data <- data.frame(
        SOM_Cluster = cluster_assignments,
        Age_Category = values$som_data$age_category
      )

      age_summary <- age_data %>%
        group_by(SOM_Cluster, Age_Category) %>%
        summarise(count = n(), .groups = 'drop') %>%
        group_by(SOM_Cluster) %>%
        mutate(proportion = count / sum(count) * 100)

      age_order <- c("<55", "55-65", ">65")
      age_summary$Age_Category <- factor(age_summary$Age_Category, levels = age_order)

      p1 <- ggplot(age_summary, aes(x = factor(SOM_Cluster), y = proportion, fill = Age_Category)) +
        geom_bar(stat = "identity", position = "stack") +
        scale_fill_manual(values = c("<55" = "#4daf4a",
                                     "55-65" = "#ff7f00",
                                     ">65" = "#e41a1c"),
                          name = "Age Category") +
        labs(title = "Age Category Distribution",
             x = "Cluster", y = "Percentage (%)") +
        theme_minimal() +
        scale_y_continuous(expand = c(0, 0), limits = c(0, 100))

      # BMI plot
      bmi_data <- data.frame(
        SOM_Cluster = cluster_assignments,
        BMI_Category = values$som_data$bmi_category
      )

      bmi_summary <- bmi_data %>%
        group_by(SOM_Cluster, BMI_Category) %>%
        summarise(count = n(), .groups = 'drop') %>%
        group_by(SOM_Cluster) %>%
        mutate(proportion = count / sum(count) * 100)

      bmi_order <- c("Underweight", "Normal", "Overweight", "Obesity")
      bmi_summary$BMI_Category <- factor(bmi_summary$BMI_Category, levels = bmi_order)

      p2 <- ggplot(bmi_summary, aes(x = factor(SOM_Cluster), y = proportion, fill = BMI_Category)) +
        geom_bar(stat = "identity", position = "stack") +
        scale_fill_manual(values = c("Underweight" = "#2166ac",
                                     "Normal" = "#4daf4a",
                                     "Overweight" = "#ff7f00",
                                     "Obesity" = "#e41a1c"),
                          name = "BMI Category") +
        labs(title = "BMI Category Distribution",
             x = "Cluster", y = "Percentage (%)") +
        theme_minimal() +
        scale_y_continuous(expand = c(0, 0), limits = c(0, 100))

      grid.arrange(p1, p2, ncol = 1)
      dev.off()
    }
  )

  output$download_fev1 <- downloadHandler(
    filename = function() {
      paste0("fev1_distribution_with_categories_k", input$n_clusters, "_", Sys.Date(), ".pdf")
    },
    content = function(file) {
      pdf(file, width = 12, height = 8)

      som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
      unit_assignments <- values$som_model$unit.classif[1:nrow(values$som_data$data)]
      cluster_assignments <- som_cluster[unit_assignments]

      fev1_data <- data.frame(
        SOM_Cluster = cluster_assignments,
        FEV1_Category = values$som_data$fev1_category[1:nrow(values$som_data$data)]
      )

      fev1_data <- fev1_data[!is.na(fev1_data$FEV1_Category), ]

      fev1_summary <- fev1_data %>%
        group_by(SOM_Cluster, FEV1_Category) %>%
        summarise(count = n(), .groups = 'drop') %>%
        group_by(SOM_Cluster) %>%
        mutate(proportion = count / sum(count) * 100)

      gold_order <- c("Mild (GOLD I)", "Moderate (GOLD II)",
                      "Severe (GOLD III)", "Very severe (GOLD IV)")
      fev1_summary$FEV1_Category <- factor(fev1_summary$FEV1_Category, levels = gold_order)

      p <- ggplot(fev1_summary, aes(x = factor(SOM_Cluster), y = proportion, fill = FEV1_Category)) +
        geom_bar(stat = "identity", position = "stack") +
        scale_fill_manual(values = c("Mild (GOLD I)" = "#2166ac",
                                     "Moderate (GOLD II)" = "#67a9cf",
                                     "Severe (GOLD III)" = "#f4a582",
                                     "Very severe (GOLD IV)" = "#b2182b"),
                          name = "FEV1 Category") +
        labs(title = sprintf("FEV1 Category Distribution Across %d Clusters", input$n_clusters),
             x = "Cluster",
             y = "Percentage (%)") +
        theme_minimal() +
        theme(plot.title = element_text(size = 14, face = "bold"),
              legend.position = "right") +
        scale_y_continuous(expand = c(0, 0), limits = c(0, 100))

      print(p)
      dev.off()
    }
  )

  output$download_bode <- downloadHandler(
    filename = function() {
      paste0("bode_analysis_with_categories_k", input$n_clusters, "_", Sys.Date(), ".pdf")
    },
    content = function(file) {
      pdf(file, width = 10, height = 8)

      som_cluster <- cutree(hclust(dist(values$som_model$codes[[1]])), input$n_clusters)
      unit_assignments <- values$som_model$unit.classif[1:nrow(values$som_data$data)]
      cluster_assignments <- som_cluster[unit_assignments]

      bode_data <- data.frame(
        SOM_Cluster = factor(cluster_assignments),
        BODE_total = values$som_data$bode_total[1:nrow(values$som_data$data)]
      )
      bode_data <- bode_data[!is.na(bode_data$BODE_total), ]

      p <- ggplot(bode_data, aes(x = SOM_Cluster, y = BODE_total, fill = SOM_Cluster)) +
        geom_boxplot(alpha = 0.8, outlier.shape = 21, outlier.size = 2) +
        geom_jitter(width = 0.15, alpha = 0.3, size = 1) +
        scale_fill_brewer(palette = "Set1", name = "Cluster") +
        labs(title = sprintf("BODE Score Distribution Across %d Clusters", input$n_clusters),
             x = "Cluster",
             y = "BODE Score (0-10)") +
        theme_minimal() +
        theme(plot.title = element_text(size = 14, face = "bold"),
              legend.position = "none") +
        scale_y_continuous(breaks = seq(0, 10, 2), limits = c(-0.5, 10.5)) +
        geom_hline(yintercept = c(3, 6, 8), linetype = "dashed", alpha = 0.3, color = "gray")

      print(p)
      dev.off()
    }
  )

  output$download_validation <- downloadHandler(
    filename = function() {
      paste0("cluster_validation_chisq_k", input$n_clusters, "_", Sys.Date(), ".pdf")
    },
    content = function(file) {
      # Calculate dimensions based on number of clusters
      nrows <- ceiling(input$n_clusters / 3)
      pdf_height <- max(10, nrows * 4)

      pdf(file, width = 14, height = pdf_height)

      results <- validation_results()

      # Plot 1: Heatmap
      p1 <- ggplot(results, aes(x = Variable, y = factor(Cluster))) +
        geom_tile(aes(fill = Difference), color = "white", size = 0.5) +
        geom_text(aes(label = ifelse(Significance != "ns", Significance, "")),
                  size = 5, fontface = "bold") +
        scale_fill_gradient2(low = "#2166ac", mid = "white", high = "#b2182b",
                            midpoint = 0,
                            limits = c(-max(abs(results$Difference)), max(abs(results$Difference))),
                            name = "Difference from\nPopulation (%)") +
        labs(title = "Cluster Validation: Deviation from Population Prevalence",
             subtitle = "Chi-square tests with significance markers (*, **, ***)",
             x = "Comorbidity / Variable",
             y = "Cluster") +
        theme_minimal() +
        theme(axis.text.x = element_text(angle = 45, hjust = 1, size = 11),
              axis.text.y = element_text(size = 11),
              plot.title = element_text(size = 14, face = "bold"),
              plot.subtitle = element_text(size = 11))

      # Plot 2: Deviation bars with improved layout
      results$is_significant <- results$P_Value < 0.05
      results$Cluster_Label <- paste("Cluster", results$Cluster)

      # Reorder variables by average absolute deviation
      var_order <- results %>%
        group_by(Variable) %>%
        summarise(avg_abs_diff = mean(abs(Difference))) %>%
        arrange(desc(avg_abs_diff)) %>%
        pull(Variable)

      results$Variable <- factor(results$Variable, levels = var_order)

      ncol_val <- ifelse(input$n_clusters <= 3, input$n_clusters, 3)

      p2 <- ggplot(results, aes(x = Variable, y = Difference, fill = is_significant)) +
        geom_hline(yintercept = 0, linetype = "dashed", color = "gray40", linewidth = 0.8) +
        geom_bar(stat = "identity", width = 0.7) +
        facet_wrap(~ Cluster_Label, ncol = ncol_val, scales = "free_y") +
        scale_fill_manual(values = c("FALSE" = "gray70", "TRUE" = "#d95f02"),
                         name = "Significant",
                         labels = c("No (p ≥ 0.05)", "Yes (p < 0.05)")) +
        labs(title = "Deviation from Population Mean by Cluster",
             subtitle = "Percentage point difference; orange bars = significant (p < 0.05)",
             x = "",
             y = "Difference from Population (percentage points)") +
        theme_minimal() +
        theme(axis.text.x = element_text(angle = 45, hjust = 1, size = 10),
              axis.text.y = element_text(size = 10),
              strip.text = element_text(face = "bold", size = 12),
              strip.background = element_rect(fill = "gray90", color = NA),
              plot.title = element_text(size = 14, face = "bold"),
              plot.subtitle = element_text(size = 10),
              panel.spacing = unit(1, "lines"))

      print(p1)
      print(p2)
      dev.off()
    }
  )

  output$download_fisher_validation <- downloadHandler(
    filename = function() {
      paste0("cluster_validation_fisher_k", input$n_clusters, "_", Sys.Date(), ".pdf")
    },
    content = function(file) {
      # Calculate dimensions based on number of clusters
      nrows <- ceiling(input$n_clusters / 3)
      pdf_height <- max(10, nrows * 4)

      pdf(file, width = 14, height = pdf_height)

      results <- fisher_validation_results()

      # Plot 1: Heatmap
      p1 <- ggplot(results, aes(x = Variable, y = factor(Cluster))) +
        geom_tile(aes(fill = Difference), color = "white", size = 0.5) +
        geom_text(aes(label = ifelse(Significance != "ns", Significance, "")),
                  size = 5, fontface = "bold") +
        scale_fill_gradient2(low = "#2166ac", mid = "white", high = "#b2182b",
                            midpoint = 0,
                            limits = c(-max(abs(results$Difference)), max(abs(results$Difference))),
                            name = "Difference from\nPopulation (%)") +
        labs(title = "Cluster Validation: Deviation from Population Prevalence (Fisher's Exact Test)",
             subtitle = "Significance markers (*, **, ***)",
             x = "Comorbidity / Variable",
             y = "Cluster") +
        theme_minimal() +
        theme(axis.text.x = element_text(angle = 45, hjust = 1, size = 11),
              axis.text.y = element_text(size = 11),
              plot.title = element_text(size = 14, face = "bold"),
              plot.subtitle = element_text(size = 11))

      # Plot 2: Deviation bars with improved layout
      results$is_significant <- results$P_Value < 0.05
      results$Cluster_Label <- paste("Cluster", results$Cluster)

      # Reorder variables by average absolute deviation
      var_order <- results %>%
        group_by(Variable) %>%
        summarise(avg_abs_diff = mean(abs(Difference))) %>%
        arrange(desc(avg_abs_diff)) %>%
        pull(Variable)

      results$Variable <- factor(results$Variable, levels = var_order)

      ncol_val <- ifelse(input$n_clusters <= 3, input$n_clusters, 3)

      p2 <- ggplot(results, aes(x = Variable, y = Difference, fill = is_significant)) +
        geom_hline(yintercept = 0, linetype = "dashed", color = "gray40", linewidth = 0.8) +
        geom_bar(stat = "identity", width = 0.7) +
        facet_wrap(~ Cluster_Label, ncol = ncol_val, scales = "free_y") +
        scale_fill_manual(values = c("FALSE" = "gray70", "TRUE" = "#1b9e77"),
                         name = "Significant",
                         labels = c("No (p ≥ 0.05)", "Yes (p < 0.05)")) +
        labs(title = "Deviation from Population Mean by Cluster (Fisher's Exact Test)",
             subtitle = "Percentage point difference; green bars = significant (p < 0.05)",
             x = "",
             y = "Difference from Population (percentage points)") +
        theme_minimal() +
        theme(axis.text.x = element_text(angle = 45, hjust = 1, size = 10),
              axis.text.y = element_text(size = 10),
              strip.text = element_text(face = "bold", size = 12),
              strip.background = element_rect(fill = "gray90", color = NA),
              plot.title = element_text(size = 14, face = "bold"),
              plot.subtitle = element_text(size = 10),
              panel.spacing = unit(1, "lines"))

      print(p1)
      print(p2)
      dev.off()
    }
  )
}

# Run the app
shinyApp(ui = ui, server = server)
