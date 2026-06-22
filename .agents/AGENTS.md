
# Cloudflare Deployment Rule
Always ensure deployments to Cloudflare are marked as Production. When pushing to GitHub, ensure the branch matches Cloudflare's Production branch. When using Wrangler, always append the exact production branch flag (e.g. --branch main or --branch production) to avoid Preview deployments.
