# SOM Clustering Comparison Guide

This document explains the differences between the two SOM clustering implementations and how to compare their results.

## Files

1. **`som_interactive_app.R`** - Original version
   - Uses only 11 binary comorbidity variables
   - All variables weighted equally (weight = 1.0)
   - Total: 11 variables

2. **`som_interactive_app_with_categories.R`** - Enhanced version
   - Uses 11 binary comorbidity variables + Age categories + BMI categories
   - Custom weighting scheme to balance categorical variables
   - Total: 18 variables (11 + 3 + 4)

## Key Differences

### Variables Included

| Version | Comorbidities | Age | BMI | Total Variables |
|---------|--------------|-----|-----|-----------------|
| Original | 11 (binary) | ❌ | ❌ | 11 |
| Enhanced | 11 (binary) | 3 (one-hot) | 4 (one-hot) | 18 |

### Variable Weighting

**Original version:**
- All 11 comorbidity variables: weight = 1.0

**Enhanced version:**
- 11 comorbidity variables: weight = 1.0 each
- 3 age category indicators: weight = 1/√3 ≈ 0.577 each
- 4 BMI category indicators: weight = 1/√4 = 0.5 each

**Rationale:** This weighting ensures that:
- Each conceptual variable (Age or BMI) contributes equally regardless of number of categories
- Categorical variables don't dominate distance calculations due to higher dimensionality
- The total contribution of Age categories: 3 × 0.577² ≈ 1.0
- The total contribution of BMI categories: 4 × 0.5² = 1.0

### Age Categories

| Category | Definition | Example Ages |
|----------|------------|--------------|
| `<55` | Age ≤ 55 years | 39, 45, 55 |
| `55-65` | 55 < Age ≤ 65 | 56, 60, 65 |
| `>65` | Age > 65 years | 66, 72, 92 |

**Distribution in HIFLO dataset:**
- `<55`: 18 patients (7.6%)
- `55-65`: 74 patients (31.1%)
- `>65`: 146 patients (61.3%)

### BMI Categories

| Category | Definition | BMI Range |
|----------|------------|-----------|
| Underweight | BMI < 18.5 | 14.7 - 18.4 |
| Normal | 18.5 ≤ BMI < 25 | 18.5 - 24.9 |
| Overweight | 25 ≤ BMI < 30 | 25.0 - 29.9 |
| Obesity | BMI ≥ 30 | 30.0 - 71.5 |

**Distribution in HIFLO dataset:**
- Underweight: 18 patients (7.6%)
- Normal: 83 patients (34.9%)
- Overweight: 73 patients (30.7%)
- Obesity: 64 patients (26.9%)

## Data Handling

### Missing Data
- **Original:** Replaces NA in comorbidities with 0, retains all 238 rows
- **Enhanced:** Excludes rows with missing Age or BMI (currently 0 rows excluded), replaces NA in comorbidities with 0

### Sample Size
Both versions use the same 238 patients from the HIFLO dataset (no missing Age/BMI data).

## How to Run

### Original Version
```r
# In R console or RStudio
library(shiny)
runApp("Rcode/Visualization/som_interactive_app.R")
```

### Enhanced Version
```r
# In R console or RStudio
library(shiny)
runApp("Rcode/Visualization/som_interactive_app_with_categories.R")
```

### From Command Line
```bash
# Original version
Rscript -e "library(shiny); runApp('Rcode/Visualization/som_interactive_app.R')"

# Enhanced version
Rscript -e "library(shiny); runApp('Rcode/Visualization/som_interactive_app_with_categories.R')"
```

## Comparison Strategy

### 1. Clustering Metrics Comparison
Run both apps with the **same grid settings** (e.g., 8×8) and compare:
- Optimal number of clusters (k) by each metric
- Silhouette coefficient values
- Calinski-Harabasz index values
- Davies-Bouldin index values
- Dunn index values

**Expected differences:**
- Enhanced version may suggest different optimal k due to additional dimensions
- Absolute metric values will differ but trends may be similar

### 2. Cluster Characteristics Comparison
For the **same k value** (e.g., k=6), compare:

**Original version:**
- Only shows comorbidity prevalence by cluster

**Enhanced version:**
- Shows comorbidity prevalence by cluster
- Shows age distribution by cluster
- Shows BMI distribution by cluster

### 3. Clinical Interpretation Comparison

Compare how clusters differ in terms of:

| Aspect | Original | Enhanced |
|--------|----------|----------|
| Comorbidity patterns | ✓ | ✓ |
| Age composition | ❌ | ✓ |
| BMI composition | ❌ | ✓ |
| BODE score distribution | ✓ | ✓ |
| FEV1 severity distribution | ✓ | ✓ |

### 4. Questions to Address

1. **Do age and BMI add clinical value?**
   - Are clusters more homogeneous with age/BMI included?
   - Do clusters show clear age or BMI patterns?

2. **Does clustering change significantly?**
   - Do patients cluster differently when age/BMI are included?
   - Are cluster sizes more balanced or less balanced?

3. **Which approach is more clinically useful?**
   - Does the enhanced version create more interpretable clusters?
   - Do clusters align better with known COPD phenotypes?

## Visualization Differences

### Original Version Tabs
1. Hexagonal Grid
2. U-Matrix
3. Component Planes (11 comorbidities only)
4. Cluster Heatmap
5. BODE Score Analysis
6. FEV1 Distribution

### Enhanced Version Additional Features
- Component Planes shows 18 variables (11 + 3 + 4)
- New "Age/BMI Distribution" tab with:
  - Age category distribution by cluster
  - BMI category distribution by cluster
- Cluster summary table includes age and BMI percentages

## Expected Insights

### If Age/BMI Matter for Clustering
- Enhanced version should show:
  - Different optimal k
  - Clusters with distinct age/BMI profiles
  - Better separation in certain dimensions

### If Age/BMI Don't Matter Much
- Both versions should show:
  - Similar optimal k
  - Similar comorbidity patterns
  - Age/BMI distributed similarly across clusters

## Technical Details

### Data Preparation Pipeline

**Original:**
```
Raw Data → Select 11 comorbidities → Convert to numeric →
Replace NA with 0 → Scale → Train SOM
```

**Enhanced:**
```
Raw Data → Filter missing Age/BMI → Select 11 comorbidities →
Convert to numeric → Replace NA with 0 →
Categorize Age/BMI → One-hot encode →
Apply weights → Scale → Train SOM
```

### Distance Calculation Impact

The enhanced version effectively computes distances as:

```
d = sqrt(
  Σ(comorbidity differences)² +              # 11 terms, weight 1.0
  Σ(age category differences)² × (1/3) +     # 3 terms, weight 1/√3
  Σ(BMI category differences)² × (1/4)       # 4 terms, weight 1/√4
)
```

This ensures that age and BMI each contribute approximately as much as one comorbidity variable to the overall distance.

## Export and Documentation

Both apps support exporting:
- Clustering metrics plots
- Cluster assignment plots
- Component planes
- Heatmaps
- Distribution plots

Use these exports to create side-by-side comparisons in publications or presentations.

## Troubleshooting

### If the enhanced app doesn't load:
1. Check all packages are installed (see below)
2. Verify data file path is correct
3. Check for sufficient memory (SOM training with more variables requires more RAM)

### Required R Packages

Both versions require:
```r
install.packages(c(
  "shiny", "shinydashboard", "shinyWidgets",
  "kohonen", "cluster", "fpc", "clValid", "clusterSim",
  "ggplot2", "dplyr", "tidyr", "hexbin", "viridis",
  "RColorBrewer", "gridExtra", "DT"
))
```

## References

- Kohonen SOM: Kohonen, T. (2001). Self-Organizing Maps. Springer.
- One-hot encoding: Standard technique for categorical variables in machine learning
- Variable weighting: Ensures balanced contribution from categorical variables

## Contact

For questions about:
- **Original implementation:** See comorbidity-only clustering
- **Enhanced implementation:** See comorbidity + demographics clustering
- **Comparison methodology:** See this guide

---

**Last Updated:** 2025-11-05
