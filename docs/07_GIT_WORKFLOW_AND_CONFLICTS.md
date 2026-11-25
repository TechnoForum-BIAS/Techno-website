# 🛡️ Technoforum BIAS: Git Workflow & Merge Conflict Resolution

This guide outlines our team Git flow, the rules to avoid merge conflicts, and step-by-step instructions on how to resolve conflicts cleanly without losing work.

---

## 1. Branch Hierarchy

```
                          ┌── feat/g1-landing-events (Intern 1 & 2)
                          │
main ────── develop ──────┼── feat/g2-inventory-scanner (Intern 3 & 4)
                          │
                          └── feat/g3-certificates-studio (Intern 5 & 6)
```

* **`main`**: Production release only. Never push directly to `main`.
* **`develop`**: Primary staging branch where all feature PRs are merged and tested.
* **`feat/...`**: The 3 isolated feature branches where each intern group writes code.

---

## 2. The 5 Golden Rules to Completely Avoid Conflicts

1. **Never Touch Core Shared Files**:
   Do NOT edit `App.jsx`, `Navbar.jsx`, `Footer.jsx`, `server/src/index.js`, or root `package.json`. Your subcomponents in `client/src/features/` are already wired in.
2. **One Feature, One File**:
   Work strictly inside your assigned file from the File Ownership Matrix. If Intern 1 is working on `EventCard.jsx`, Intern 2 works strictly on `EventRegistrationModal.jsx`.
3. **Daily Sync First Thing in the Morning**:
   Before writing any code each day, sync your local branch with `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout <your-assigned-branch>
   git merge develop
   ```
4. **Make Small, Atomic Commits**:
   Commit small, logical units of work instead of hoarding 20 files over several days.
5. **Always Pull with Rebase Before Pushing**:
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

---

## 3. Step-by-Step: How to Solve a Merge Conflict

If Git alerts you with `CONFLICT (content): Merge conflict in ...` during a `merge` or `rebase`, **do not panic**. Follow this 6-step protocol:

### Step 1: Identify Conflicted Files
Run:
```bash
git status
```
Git will list conflicted files in red under `Unmerged paths:`, for example:
```text
both modified:   client/src/features/group1_events/EventCard.jsx
```

### Step 2: Open the File in VS Code
Open the conflicted file. Git marks the collision with standard markers:
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

### Step 4: Verify that All Conflict Markers Are Gone
Search the file for `<<<<<<<`. If any markers remain, the code will fail to compile.

### Step 5: Stage the Resolved File
```bash
git add client/src/features/group1_events/EventCard.jsx
```

### Step 6: Complete the Merge or Rebase
* If rebasing:
  ```bash
  git rebase --continue
  ```
* If merging:
  ```bash
  git commit -m "merge: resolve conflicts with develop"
  ```

---

## 4. 🚨 Emergency Escape Hatch (Cancel & Return to Safety)

If you make an error while resolving conflicts and want to safely return your repository to the exact state it was before you started:

```bash
# If rebasing:
git rebase --abort

# If merging:
git merge --abort
```

This cancels the operation and returns your repository to a clean state without losing any of your previously committed work!
