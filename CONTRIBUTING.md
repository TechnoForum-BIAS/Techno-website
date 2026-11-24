# 🤝 Contributing Guidelines & Git Protocol

Thank you for contributing to the **Technoforum Platform**! To keep our codebase clean and prevent conflicts among 6 interns, follow these rules.

---

## 🌿 Git Branching Convention

1. **`main`**: Production code. Only repository admins can merge into `main`.
2. **`develop`**: Active staging branch.
3. **Feature branches**: Create all branches off `develop` using standard naming:
   - Group 1: `feat/g1-<feature-name>` (e.g., `feat/g1-events-filter`)
   - Group 2: `feat/g2-<feature-name>` (e.g., `feat/g2-barcode-scan`)
   - Group 3: `feat/g3-<feature-name>` (e.g., `feat/g3-canvas-editor`)
   - Bug fixes: `fix/<issue-name>`

### Workflow Commands
```bash
# 1. Start from latest develop
git checkout develop
git pull origin develop

# 2. Create your feature branch
git checkout -b feat/g1-events-filter

# 3. Work on your changes, then stage and commit
git add .
git commit -m "feat(events): add category filter pills and search bar"

# 4. Push to remote and open a Pull Request (PR) against develop
git push -u origin feat/g1-events-filter
```

---

## ✍️ Commit Message Guidelines

Use conventional commits:
* `feat:` New user-facing feature (e.g. `feat(inventory): add AI scanner modal`)
* `fix:` Bug fix (e.g. `fix(certificates): correct coordinate offset on PDF canvas`)
* `docs:` Documentation changes (e.g. `docs: update intern task checklist`)
* `style:` Code style, formatting, or Tailwind tweaks
* `refactor:` Code reorganization without feature changes

---

## 📋 Pull Request (PR) Checklist Before Requesting Review

- [ ] Does `npm run build` pass in `client/` without errors?
- [ ] Are there any `console.log` debug statements left that should be removed?
- [ ] Have you tested the feature on both Desktop and Mobile screen widths?
- [ ] Are sensitive tokens or passwords in `.env` kept out of git commits?
- [ ] Has your group partner reviewed your code first?
