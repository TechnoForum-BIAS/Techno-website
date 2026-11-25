# 🛡️ Technoforum BIAS: Git Workflow & Merge Conflict Resolution

This guide outlines our team Git flow, the Clone vs Fork strategy, how each intern commits to their own branch, and step-by-step instructions on resolving conflicts cleanly.

---

## 1. Clone vs Fork Strategy: Which is Best?

### 🏆 Recommended: Direct Clone as Collaborators (Industry Standard)
The repository admin invites all 6 interns as **Collaborators** with `Write` access to `https://github.com/TechnoForum-BIAS/Techno-website.git`.

* **Why Direct Clone is Best for Interns**:
  1. **Single Remote**: Interns only have `origin`. Beginners do not have to manage confusing dual remotes (`origin` vs `upstream`).
  2. **Dedicated Branches Pre-Created**: All 6 individual branches are already pushed to the remote repository. An intern simply runs `git checkout <their-branch>` and starts coding.
  3. **Protected Main & Develop**: GitHub Branch Protection rules block anyone from accidentally pushing directly to `main` or `develop`. Work can only enter via reviewed Pull Requests.

### What about Forking?
* Forking is used in public open-source projects where contributors do not know each other.
* For an internal team of 6 interns, forking adds unnecessary friction (keeping forks in sync with `upstream`, branch desynchronization, and complex multi-remote rebases).

---

## 2. The 6-Branch Architecture (Zero Teammate Conflicts)

To prevent teammates inside the same group from conflicting with each other, **every single intern has their own dedicated feature branch**:

```
                                  develop (Staging Integration)
                                                │
        ┌───────────────────────┬───────────────┴───────────────┬───────────────────────┐
        ▼                       ▼                               ▼                       ▼
GROUP 1:                GROUP 2:                        GROUP 3:
├── feat/intern1-...    ├── feat/intern3-...            ├── feat/intern5-...
└── feat/intern2-...    └── feat/intern4-...            └── feat/intern6-...
```

| Intern | Personal Feature Branch | Isolated Component Ownership |
| :--- | :--- | :--- |
| **Intern 1** | `feat/intern1-hero-events` | `Hero3D.jsx`, `EventCard.jsx`, `events.routes.js` |
| **Intern 2** | `feat/intern2-registration-notices` | `EventRegistrationModal.jsx`, `AnnouncementsPage.jsx`, `events.controller.js` |
| **Intern 3** | `feat/intern3-catalog-barcodes` | `InventoryItemCard.jsx`, `BarcodeModal.jsx`, `barcodeGenerator.js` |
| **Intern 4** | `feat/intern4-scanner-cart` | `AiTableScannerModal.jsx`, `IssueCartDrawer.jsx`, `inventory.controller.js` |
| **Intern 5** | `feat/intern5-template-csv` | `TemplateUploader.jsx`, `CsvRosterUploader.jsx`, `certificates.routes.js` |
| **Intern 6** | `feat/intern6-canvas-pdf-engine` | `CanvasCoordinateEditor.jsx`, `BatchZipGenerator.jsx`, `CertificateVerifyPage.jsx` |

### Why Teammate Conflicts Cannot Happen:
1. Intern 1 and Intern 2 work in the same domain (Events), but Intern 1 only pushes to `feat/intern1-hero-events` and Intern 2 only pushes to `feat/intern2-registration-notices`.
2. Git will **NEVER reject their push** because they are not pushing to the same branch.
3. Because Intern 1 and Intern 2 edit completely separate files in `client/src/features/`, when both open PRs against `develop`, GitHub merges both **automatically with 0 merge conflicts**!

---

## 3. How to Commit & Push to Your Personal Branch

```bash
# 1. Switch to your dedicated branch
git checkout <your-assigned-branch>

# 2. Check changed files
git status

# 3. Stage your files
git add <path-to-your-assigned-file>

# 4. Commit with descriptive message
git commit -m "feat(module): descriptive message of what you built"

# 5. Before pushing, sync with latest develop
git fetch origin
git rebase origin/develop

# 6. Push to remote
git push origin <your-assigned-branch>

# 7. Open Pull Request on GitHub against 'develop'
```

---

## 4. Step-by-Step: How to Solve a Merge Conflict

If Git ever alerts you with `CONFLICT (content): Merge conflict in ...` during a `merge` or `rebase`:

### Step 1: Identify Conflicted Files
Run:
```bash
git status
```
Git will list conflicted files in red under `Unmerged paths:`.

### Step 2: Open the File in VS Code
Look for the standard Git conflict markers:
```javascript
<<<<<<< HEAD (Current Change - Your Local Code)
<button className="px-4 py-2 bg-brand-blue text-white rounded-xl">
  Register for Event
</button>
=======
<button className="px-4 py-2 bg-gradient-to-r from-brand-blue to-cyan-500 text-white rounded-xl font-bold">
  Register Participation Now
</button>
>>>>>>> develop (Incoming Change - Remote Code)
```

### Step 3: Choose the Correct Code
In VS Code, clickable buttons appear above the conflict:
* **Accept Current Change**: Keeps your local code and discards incoming remote code.
* **Accept Incoming Change**: Takes the remote code from `develop` and discards your local lines.
* **Manual Edit (Recommended)**: Delete the `<<<<<<<`, `=======`, and `>>>>>>>` lines manually and combine the best of both blocks into clean, valid code.

### Step 4: Verify and Stage
Search for `<<<<<<<`. If no markers remain:
```bash
git add <resolved-file-path>
```

### Step 5: Complete Rebase or Merge
* If rebasing: `git rebase --continue`
* If merging: `git commit -m "merge: resolve conflicts with develop"`

---

## 5. 🚨 Emergency Escape Hatch (Cancel & Return to Safety)

If you get stuck or make a mistake while resolving conflicts:

```bash
# If rebasing:
git rebase --abort

# If merging:
git merge --abort
```

This immediately cancels the operation and returns your repository to a clean state without losing any committed work!
