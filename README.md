# Teja Swaroop — Earlier Static Portfolio

A static HTML/CSS portfolio containing an introduction, experience/education tabs, project sections, work samples, and contact links. This is an earlier portfolio; its page content and bundled resumes may predate my current AI engineering profile.

## Stack and structure

- `index.html`: page content and inline JavaScript for tabs/menu/contact submission
- `style.css`: styles
- `images/`: images and earlier resume PDFs
- External Font Awesome icons and a Google Apps Script contact endpoint

## Run locally

Requires Python 3, with no package installation:

```bash
python -m http.server 8000
```

Open http://localhost:8000. Deploy the root folder to any static host.

## Current limitations

Some project links are placeholders (`#`). The contact form depends on an external Apps Script endpoint; delivery has not been verified. Bundled resume PDFs should be checked before sharing. This repo has no automated browser/accessibility test suite.

## Modernization priorities

Update content against my latest resume, replace placeholder links, confirm contact delivery or use an email link, add responsive/accessibility checks, and use case studies for the strongest engineering projects.

Current public work: [InsightForge](https://github.com/tejaswaroop999/personalized-ai-report), [LLM Evaluation Platform](https://github.com/tejaswaroop999/llm-evaluation-platform), and [ShoeMatch](https://github.com/tejaswaroop999/ShoeMatch).
