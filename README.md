# 👻🧱🚀 Arcade Contribution Graph Games

![Active users count][active-users-shield]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Contributors][contributors-shield]][contributors-url]
[![Stand with Palestine][stand-with-palestine-shield]][stand-with-palestine-url]
[![Buy Me a Coffee][buy-me-a-coffee-shield]][buy-me-a-coffee-url]

Transform your GitHub or GitLab contribution graph into arcade games! This JavaScript library offers a unique and engaging way to visualize your coding activity over the past year.

## 🕹️ Available Games

| Game                 | Description                                                          |
| -------------------- | -------------------------------------------------------------------- |
| 👻 **Pac-Man**       | Pac-Man eats your contributions while ghosts give chase              |
| 🧱 **Breakout**      | A ball bounces around breaking your contribution bricks              |
| 🚀 **Galaga**        | A fighter ship shoots lasers at your contribution grid               |
| 🫧 **Puzzle Bobble** | A cannon fires colored bubbles to pop matching contribution clusters |
| 💣 **Bomberman**     | Two bombers blast contribution cells across the graph                |

More games coming soon!

### Pac-Man preview

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/pacman-contribution-graph-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/pacman-contribution-graph.svg">
  <img alt="pacman contribution graph" src="https://raw.githubusercontent.com/abozanona/abozanona/output/pacman-contribution-graph.svg">
</picture>

### Breakout preview

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/breakout-contribution-graph-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/breakout-contribution-graph.svg">
  <img alt="breakout contribution graph" src="https://raw.githubusercontent.com/abozanona/abozanona/output/breakout-contribution-graph.svg">
</picture>

### Galaga preview

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/galaga-contribution-graph-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/galaga-contribution-graph.svg">
  <img alt="galaga contribution graph" src="https://raw.githubusercontent.com/abozanona/abozanona/output/galaga-contribution-graph.svg">
</picture>

### Puzzle Bobble preview

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/puzzle-bobble-contribution-graph-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/puzzle-bobble-contribution-graph.svg">
  <img alt="puzzle bobble contribution graph" src="https://raw.githubusercontent.com/abozanona/abozanona/output/puzzle-bobble-contribution-graph.svg">
</picture>

### Bomberman preview

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/bomberman-contribution-graph-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/abozanona/abozanona/output/bomberman-contribution-graph.svg">
  <img alt="bomberman contribution graph" src="https://raw.githubusercontent.com/abozanona/abozanona/output/bomberman-contribution-graph.svg">
</picture>

## 🎮 Features

Elevate your GitHub profile with the Pac-Man Contribution Graph Game and add a playful touch to your coding journey!

- **Contribution Visualization**: Converts your GitHub or GitLab contribution data into a colorful grid.
- **Multiple Games**: Classic Pac-Man, Breakout, Galaga, Puzzle Bobble, and Bomberman, with more planned
- **Multiple Themes**: Choose between different themes, such as GitHub Dark and GitLab Dark.
- **Customizable Settings**: Adjust game settings.
- **GitHub Integration**: Automatically fetches your contribution data via GraphQL API
- **GitHub Action**: Easy to add to your profile or website README

## 🕹️ Demo

Experience the games firsthand:
**Live Demo**: [Pac-Man Contribution Game](https://abozanona.github.io/pacman-contribution-graph/)

## 🔧 Installation

To integrate the Pac-Man Contribution Graph into your project, you can install it via npm:

```bash
npm install pacman-contribution-graph
```

Alternatively, include it directly in your HTML using jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/pacman-contribution-graph/dist/pacman-contribution-graph.min.js"></script>
```

## 🧩 Usage

Here's how to set up and run the games:

1. **Include the Library**: Ensure the library is included in your project, either via npm or a script tag.
2. **Initialize the Game**: Use the following code to generate an arcade game:

    **Pac-Man:**

    ```javascript
    import { PacmanRenderer, PlayerStyle } from 'pacman-contribution-graph';

    const renderer = new PacmanRenderer({
    	username: 'your_username',
    	platform: 'github', // or 'gitlab'
    	gameTheme: 'github-dark', // 'github', 'github-dark', 'gitlab', or 'gitlab-dark'
    	playerStyle: PlayerStyle.OPPORTUNISTIC, // CONSERVATIVE, AGGRESSIVE, or OPPORTUNISTIC
    	svgCallback: (svg) => {
    		// called with the generated SVG string
    		document.getElementById('output').innerHTML = svg;
    	},
    	gameOverCallback: () => {
    		console.log('Game over!');
    	},
    	pointsIncreasedCallback: (points) => {
    		console.log('Score:', points);
    	}
    });
    renderer.start();
    ```

    **Breakout:**

    ```javascript
    import { BreakoutRenderer } from 'pacman-contribution-graph';

    const renderer = new BreakoutRenderer({
    	username: 'your_username',
    	platform: 'github', // or 'gitlab'
    	gameTheme: 'github-dark', // 'github', 'github-dark', 'gitlab', or 'gitlab-dark'
    	svgCallback: (svg) => {
    		document.getElementById('output').innerHTML = svg;
    	},
    	gameOverCallback: () => {
    		console.log('Game over!');
    	},
    	pointsIncreasedCallback: (points) => {
    		console.log('Score:', points);
    	}
    });
    renderer.start();
    ```

    **Galaga:**

    ```javascript
    import { GalagaRenderer } from 'pacman-contribution-graph';

    const renderer = new GalagaRenderer({
    	username: 'your_username',
    	platform: 'github', // or 'gitlab'
    	gameTheme: 'github-dark', // 'github', 'github-dark', 'gitlab', or 'gitlab-dark'
    	svgCallback: (svg) => {
    		document.getElementById('output').innerHTML = svg;
    	},
    	gameOverCallback: () => {
    		console.log('Game over!');
    	},
    	pointsIncreasedCallback: (points) => {
    		console.log('Score:', points);
    	}
    });
    renderer.start();
    ```

    **Puzzle Bobble:**

    ```javascript
    import { PuzzleBobbleRenderer } from 'pacman-contribution-graph';

    const renderer = new PuzzleBobbleRenderer({
    	username: 'your_username',
    	platform: 'github', // or 'gitlab'
    	gameTheme: 'github-dark', // 'github', 'github-dark', 'gitlab', or 'gitlab-dark'
    	svgCallback: (svg) => {
    		document.getElementById('output').innerHTML = svg;
    	},
    	gameOverCallback: () => {
    		console.log('Game over!');
    	},
    	pointsIncreasedCallback: (points) => {
    		console.log('Score:', points);
    	}
    });
    renderer.start();
    ```

    **Bomberman:**

    ```javascript
    import { BombermanRenderer } from 'pacman-contribution-graph';

    const renderer = new BombermanRenderer({
        username: 'your_username',
        platform: 'github', // or 'gitlab'
        gameTheme: 'github-dark', // 'github', 'github-dark', 'gitlab', or 'gitlab-dark'
        svgCallback: (svg) => {
            document.getElementById('output').innerHTML = svg;
        },
        gameOverCallback: () => {
            console.log('Game over!');
        },
        pointsIncreasedCallback: (points) => {
            console.log('Score:', points);
        }
    });
    renderer.start();
    ```

3. **Customize Settings**: Adjust the parameters as needed:
    - `username`: Your GitHub or GitLab username.
    - `platform`: Specify `'github'` or `'gitlab'`.
    - `gameTheme`: Choose between `'github'`, `'github-dark'`, `'gitlab'`, or `'gitlab-dark'`.
    - `playerStyle` _(Pac-Man only)_: `PlayerStyle.OPPORTUNISTIC` (default), `PlayerStyle.CONSERVATIVE`, or `PlayerStyle.AGGRESSIVE`.
    - `svgCallback`: Called with the finished SVG string once generation is complete.
    - `gameOverCallback`: Called when the game finishes.
    - `pointsIncreasedCallback`: Called each time the score increases.
    - `gameStatsCallback`: Called at the end with `{ totalScore, steps, ghostsEaten }`.
    - `githubSettings`: `{ accessToken: 'your_token' }` for private contribution data.

## Integrate into Your GitHub Profile

To showcase the Pac-Man game on your GitHub profile, follow these steps:

1. **Create a Special Repository**:

    - Name a new repository exactly as your GitHub username (e.g., `username/username`).
    - This repository powers your GitHub profile page.

2. **Set Up GitHub Actions**:

    - In the repository, create a `.github/workflows/` directory.
    - Add a `main.yml` file with the following content:

        ```yaml
        name: generate arcade contribution graphs

        on:
            schedule: # Run automatically every 24 hours
                - cron: '0 0 * * *'
            workflow_dispatch: # Allows manual triggering
            push: # Runs on every push to the main branch
                branches:
                    - main

        jobs:
            generate:
                permissions:
                    contents: write
                runs-on: ubuntu-latest
                timeout-minutes: 20

                steps:
                    - name: generate contribution graph SVGs
                      uses: abozanona/pacman-contribution-graph@main
                      with:
                          github_user_name: ${{ github.repository_owner }}
                          # Comma-separated list of games to generate.
                          # Valid values: pacman, breakout, galaga, puzzle-bobble, bomberman
                          # Default: pacman
                          games: 'pacman,breakout,galaga,puzzle-bobble,bomberman'

                    # Push the generated SVGs to the output branch
                    - name: push SVGs to the output branch
                      uses: crazy-max/ghaction-github-pages@v3.1.0
                      with:
                          target_branch: output
                          build_dir: dist
                      env:
                          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        ```

3. **Add to Profile README**:

    - In your repository, create or edit the `README.md` file to include:

        ```markdown
        ## My Contribution Graph

        <!-- Pac-Man -->
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/pacman-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/pacman-contribution-graph.svg">
            <img alt="pacman contribution graph" src="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/pacman-contribution-graph.svg">
        </picture>

        <!-- Breakout -->
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/breakout-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/breakout-contribution-graph.svg">
            <img alt="breakout contribution graph" src="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/breakout-contribution-graph.svg">
        </picture>

        <!-- Galaga -->
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/galaga-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/galaga-contribution-graph.svg">
            <img alt="galaga contribution graph" src="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/galaga-contribution-graph.svg">
        </picture>

        <!-- Puzzle Bobble -->
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/puzzle-bobble-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/puzzle-bobble-contribution-graph.svg">
            <img alt="puzzle bobble contribution graph" src="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/puzzle-bobble-contribution-graph.svg">
        </picture>

        <!-- Bomberman -->
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/bomberman-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/bomberman-contribution-graph.svg">
            <img alt="bomberman contribution graph" src="https://raw.githubusercontent.com/[USERNAME]/[USERNAME]/output/bomberman-contribution-graph.svg">
        </picture>
        ```

4. **Commit and Push**:
    - Push the changes to GitHub. The GitHub Actions workflow will run daily, updating the Pac-Man game on your profile.

For a detailed guide, refer to the blog post: [Integrate Pac-Man Contribution Graph into Your GitHub Profile](https://abozanona.me/integrate-pacman-contribution-graph-into-github/)

## Integrate into Your GitLab Profile

To showcase the Pac-Man game on your GitLab profile, follow these steps:

1. **Create a Special Repository**:

    - Name a new repository exactly as your GitLab username (e.g., `username/username`).
    - This repository powers your GitLab profile page.

2. **Generate & Setup Push Token**:

    - Open the repository, and from left sidebar navigate to settings => Access Token tab.
    - Generate a new Access Token with the name `CI/CD Push Token` & scope `write_repository`. Access tokens are only valid for 1 year maximum.
    - From left sidebar navigate to settings => CI/CD.
    - In Variables section, add a new variable with the name `CI_PUSH_TOKEN` and the value of the Access Token. Make sure that the variable is `Masked` & `Protect`.

3. **Set Up `gitlab-ci` File**:

    - In the repository, create a `.gitlab-ci.yml` file with the following content.

        ```yaml
        stages:
            - generate
            - deploy

        variables:
            GIT_SUBMODULE_STRATEGY: recursive

        generate_graphs:
            stage: generate
            image: node:20
            script:
                - mkdir -p dist
                - npm install -g pacman-contribution-graph
                # Pac-Man
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --game pacman --gameTheme gitlab --output dist/pacman-contribution-graph.svg
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --game pacman --gameTheme gitlab-dark --output dist/pacman-contribution-graph-dark.svg
                # Breakout
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --game breakout --gameTheme gitlab --output dist/breakout-contribution-graph.svg
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --game breakout --gameTheme gitlab-dark --output dist/breakout-contribution-graph-dark.svg
                # Galaga
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --game galaga --gameTheme gitlab --output dist/galaga-contribution-graph.svg
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --game galaga --gameTheme gitlab-dark --output dist/galaga-contribution-graph-dark.svg
                # Puzzle Bobble
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --game puzzle-bobble --gameTheme gitlab --output dist/puzzle-bobble-contribution-graph.svg
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --game puzzle-bobble --gameTheme gitlab-dark --output dist/puzzle-bobble-contribution-graph-dark.svg
                # Bomberman
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --game bomberman --gameTheme gitlab --output dist/bomberman-contribution-graph.svg
                - pacman-contribution-graph --platform gitlab --username "$CI_PROJECT_NAMESPACE" --game bomberman --gameTheme gitlab-dark --output dist/bomberman-contribution-graph-dark.svg
            artifacts:
                paths:
                    - dist/pacman-contribution-graph.svg
                    - dist/pacman-contribution-graph-dark.svg
                    - dist/breakout-contribution-graph.svg
                    - dist/breakout-contribution-graph-dark.svg
                    - dist/galaga-contribution-graph.svg
                    - dist/galaga-contribution-graph-dark.svg
                    - dist/puzzle-bobble-contribution-graph.svg
                    - dist/puzzle-bobble-contribution-graph-dark.svg
                    - dist/bomberman-contribution-graph.svg
                    - dist/bomberman-contribution-graph-dark.svg
                expire_in: 1 hour
            rules:
                - if: '$CI_PIPELINE_SOURCE == "schedule"'
                - if: '$CI_PIPELINE_SOURCE == "push"'

        deploy_to_readme:
            stage: deploy
            image: alpine:latest
            script:
                - apk add --no-cache git
                - mkdir -p output
                - cp dist/*.svg output/
                - git remote set-url origin https://gitlab-ci-token:${CI_PUSH_TOKEN}@gitlab.com/${CI_PROJECT_PATH}.git
                - git config --global user.email "arcade-bot@example.com"
                - git config --global user.name "Arcade Bot"
                - git add output/*.svg
                - git commit -m "Update arcade contribution graphs [ci skip]" || echo "No changes"
                - git push origin HEAD:main
            rules:
                - if: '$CI_PIPELINE_SOURCE == "schedule"'
                - if: '$CI_PIPELINE_SOURCE == "push"'
        ```

4. **Add to Profile README**:

    - In your repository, create or edit the `README.md` file to include:

        ```markdown
        ## My Contribution Graph

        <!-- Pac-Man -->
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/pacman-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/pacman-contribution-graph.svg">
            <img alt="pacman contribution graph" src="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/pacman-contribution-graph.svg">
        </picture>

        <!-- Breakout -->
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/breakout-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/breakout-contribution-graph.svg">
            <img alt="breakout contribution graph" src="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/breakout-contribution-graph.svg">
        </picture>

        <!-- Galaga -->
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/galaga-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/galaga-contribution-graph.svg">
            <img alt="galaga contribution graph" src="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/galaga-contribution-graph.svg">
        </picture>

        <!-- Puzzle Bobble -->
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/puzzle-bobble-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/puzzle-bobble-contribution-graph.svg">
            <img alt="puzzle bobble contribution graph" src="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/puzzle-bobble-contribution-graph.svg">
        </picture>

        <!-- Bomberman -->
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/bomberman-contribution-graph-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/bomberman-contribution-graph.svg">
            <img alt="bomberman contribution graph" src="https://gitlab.com/[USERNAME]/[USERNAME]/-/raw/main/output/bomberman-contribution-graph.svg">
        </picture>
        ```

5. **Commit and Push**:

    - Push the changes to GitLab. The Gitlab pipeline will work once, updating the Pac-Man game on your profile.

6. **Schedule pipeline running**
    - Go to your project in GitLab
    - In the left sidebar, navigate to Build > Pipeline schedules (sometimes under CI/CD > Schedules)
    - Click New schedule
    - In the form:
        - Interval pattern: Enter a cron expression for daily runs. For example, `0 2 \* \* \*` to run every day at 2:00 AM (UTC).
        - Timezone: Select your preferred timezone.
        - Target branch: Choose the main branch.
    - Click Save pipeline schedule (or Create pipeline schedule).

Your pacman picture will now be generated automatically every day at the same time.

## ⏳ Run the Workflow Manually

Once you have everything set up:

- Go to the "Actions" tab in your repository
- Click "Update Pac-Man Contribution"
- Click "Run workflow" > "Run workflow"

This will start the SVG generation process and you will then be able to see the animation working in your README!
This implementation will allow your Pac-Man contribution graph to be automatically updated every day, keeping it always up to date with your latest contributions.

## 🎯 How it Works

The application uses your GitHub contribution data to:

1. Create a grid where each cell represents a day of contribution
2. Use the contribution intensity levels provided by the GitHub API:

- NONE: Days with no contributions (empty spaces in the game)
- FIRST_QUARTILE: Days with few contributions (small points, 1 point in the game)
- SECOND_QUARTILE: Days with moderate contributions (medium points, 2 points)
- THIRD_QUARTILE: Days with many contributions (large points, 5 points)
- FOURTH_QUARTILE: Days with exceptional contributions (power pellets that activate ghost-eating mode)

These levels are relative to each user's contribution pattern and are automatically calculated by GitHub, so the density of elements in the game will reflect each user's unique profile.

3. Pac-Man navigates the grid using pathfinding algorithms
4. Ghosts chase Pac-Man with unique behaviors (as in the original game)
5. All gameplay is recorded and exported as an animated SVG

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## 🙏 Acknowledgements

Inspired by the [snk](https://github.com/Platane/snk) project, which turns your GitHub contribution graph into a snake game. Special thanks to all contributors and the open-source community for their support.

## 🌐 Online tools that use Pac-Man Contribution Graph Game

- Profile Readme Generator: [Website](https://profile-readme-generator.com/) • [Pull Request](https://github.com/maurodesouza/profile-readme-generator/pull/98)

---

<p align="center">
    These ghosts work hard! Leave a cuddle before you leave.<br>
    <img src="assets/gifs/pink_pet_cafune.gif" alt="Ghost being petted" height="80">
</p>

<!-- MARKDOWN LINKS & IMAGES -->

[active-users-shield]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Felec.abozanona.me%2Fpacman-users-count-shield.php&query=%24.active_users&style=for-the-badge&label=Active%20Users
[contributors-shield]: https://img.shields.io/github/contributors/abozanona/pacman-contribution-graph.svg?style=for-the-badge
[contributors-url]: https://github.com/abozanona/pacman-contribution-graph/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/abozanona/pacman-contribution-graph.svg?style=for-the-badge
[forks-url]: https://github.com/abozanona/pacman-contribution-graph/network/members
[stars-shield]: https://img.shields.io/github/stars/abozanona/pacman-contribution-graph.svg?style=for-the-badge
[stars-url]: https://github.com/abozanona/pacman-contribution-graph/stargazers
[stand-with-palestine-shield]: https://img.shields.io/badge/🇵🇸%20%20Stand%20With%20Palestine-007A3D?style=for-the-badge&logo=liberapay&logoColor=white&labelColor=007A3D
[stand-with-palestine-url]: https://www.islamic-relief.org.uk/giving/appeals/palestine
[buy-me-a-coffee-shield]: https://img.shields.io/badge/Buy%20Me%20a%20Coffee-orange?logo=buy-me-a-coffee&style=for-the-badge
[buy-me-a-coffee-url]: https://www.buymeacoffee.com/abozanona
