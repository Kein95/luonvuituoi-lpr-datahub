# Contributing a Dataset

To add a new LPR dataset, edit `datasets.json` and submit a Pull Request.

## Steps

1. Fork this repo
2. Edit `datasets.json` — add your dataset entry (keep alphabetical order by name)
3. Submit a Pull Request with title: `Add: [Dataset Name]`

## Entry Template

```json
{
  "name": "Your Dataset Name",
  "country": "Country",
  "size": "10K",
  "frames": "single",
  "access": "public",
  "task": "recognition",
  "annotation": "plate text",
  "year": 2025,
  "source_url": "https://...",
  "notes": "Brief description."
}
```

## Field Reference

| Field | Required | Values |
|-------|----------|--------|
| `name` | Yes | Dataset name |
| `country` | Yes | Country or region |
| `size` | Yes | Number of images/plates (use "—" if unknown) |
| `frames` | Yes | `single` or `multi` or `multi (N per seq)` |
| `access` | Yes | `public`, `license`, `license-edu`, `license-staff` |
| `task` | Yes | `detection`, `recognition`, `detection + recognition`, `super-resolution + recognition`, `legibility + recognition` |
| `annotation` | Yes | What annotations are provided |
| `year` | Yes | Publication/release year |
| `source_url` | No | URL to download or request access (`null` if none) |
| `notes` | No | Brief description, access requirements |

## Guidelines

- Only add datasets relevant to license plate recognition
- Verify the source URL is correct
- Keep notes concise (1-2 sentences)
- Maintain alphabetical order by `name` in the JSON array
