# Body Fat Percentage Calculator - Claude Code Instructions

## Project: bodyfatpercentagecalc.com

### ✅ COMPLETED
- `/index.html` - 4-tab calculator (Navy, Army, FFMI, Chart)
- `/assets/css/styles.css` - Slate professional theme (#475569)
- `/assets/js/calculator.js` - All body fat calculations
- `/about/`, `/contact/`, `/privacy/`, `/terms/`
- `/blog/index.html` - 10 article listings
- `/sitemap.xml`, `/robots.txt`, `/favicon.svg`

### ⏳ NEEDS COMPLETION
1. Generate 10 blog articles (2000+ words each)
2. Generate PNG favicons
3. Generate OG image

### Blog Articles
1. body-fat-calculator-guide (74,000 searches)
2. body-fat-percentage-chart (22,200)
3. army-body-fat-calculator (22,200)
4. body-fat-percentage-women (33,100)
5. body-fat-percentage-men (22,200)
6. navy-body-fat-calculator (5,400)
7. ffmi-calculator-guide (14,800)
8. healthy-body-fat-percentage (12,100)
9. how-to-measure-body-fat (2,400)
10. body-fat-vs-bmi (supporting)

### Key Formulas
- Navy Men: 495/(1.0324 - 0.19077×log(waist-neck) + 0.15456×log(height)) - 450
- Navy Women: 495/(1.29579 - 0.35004×log(waist+hip-neck) + 0.22100×log(height)) - 450
- FFMI: LBM(kg) / height(m)²
- Normalized FFMI: FFMI + 6.1 × (1.8 - height)

### Deploy
```bash
git init && git add . && git commit -m "Initial"
vercel --prod
```
