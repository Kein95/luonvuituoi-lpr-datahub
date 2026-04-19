# Contributing to LPR Dataset Hub

## Add a New Dataset

1. Fork the repo
2. Create a JSON file at `src/content/datasets/{dataset-id}.json`
3. Submit a Pull Request to the `dev` branch with title: `Add: [Dataset Name]`

### JSON Template

```json
{
  "name": "Your Dataset Name",
  "country": "Country",
  "size": "10K",
  "frames": "Single",
  "access": "public",
  "task": "Detection + Recognition",
  "annotation": "Bounding box + plate text",
  "year": 2025,
  "source_url": "https://github.com/...",
  "notes": "Short note (~30 chars).",
  "description": "2-3 sentence description of the dataset.",
  "classes": 36,
  "resolution": "1280x720 px",
  "license_type": "CC BY 4.0",
  "paper_url": "https://arxiv.org/abs/...",
  "bibtex": "@article{key,\n  title={...},\n  author={...},\n  year={2025}\n}"
}
```

### Field Reference

| Field | Required | Example |
|-------|----------|---------|
| `name` | Yes | Dataset name |
| `country` | Yes | Country or region |
| `size` | Yes | Image count (use "—" if unknown) |
| `frames` | Yes | `Single` or `Multi` |
| `access` | Yes | `public`, `license`, `license-edu`, `license-staff` |
| `task` | Yes | `Detection + Recognition`, `Recognition`, `Super-Resolution + Recognition` |
| `annotation` | Yes | Annotation format description |
| `year` | Yes | Publication year |
| `source_url` | Yes | URL to source repo or download |
| `notes` | Yes | Short note (~30 chars, capitalized) |
| `description` | Yes | 2-3 sentence description |
| `classes` | Yes | Number of character classes |
| `resolution` | No | Typical image resolution |
| `license_type` | No | License name (MIT, CC BY, etc.) |
| `paper_url` | No | Link to paper (arxiv, IEEE, DOI) |
| `bibtex` | No | BibTeX citation string |

### File Naming

Use kebab-case: `my-dataset-name.json`

## Submit SOTA Results

1. Create a JSON file at `src/content/sota/{dataset-id}.json`
2. Submit PR to the `dev` branch

### SOTA Template

```json
{
  "dataset_id": "ccpd-2019",
  "metric": "sequence_accuracy",
  "metric_label": "Sequence Accuracy (%)",
  "results": [
    {
      "method": "Method Name",
      "paper": "Paper Title",
      "venue": "ECCV 2025",
      "year": 2025,
      "accuracy": 95.5,
      "params_m": 12.3,
      "code_url": "https://github.com/...",
      "notes": "Optional note"
    }
  ]
}
```

## Development

```bash
git clone https://github.com/Kein95/luonvuituoi-lpr-datahub.git
cd luonvuituoi-lpr-datahub
npm install --legacy-peer-deps
npm run dev       # http://localhost:4321
npm run build     # Verify build passes
```

## Guidelines

- Only LPR-related datasets
- Verify source URL is accessible
- Notes: ~30 chars, capitalized, end with period
- Frames: capitalize `Single` or `Multi`
- PR to `dev` branch (not `main`)
- `main` is protected — requires review
