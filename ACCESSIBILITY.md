# Accessibility

shqip.ee should be usable by everyone who wants to read or write Albanian in the Elbasan, Vithkuqi or Todhri scripts: with a mouse, a keyboard, a touch screen or a screen reader, on a phone or a computer, in light or dark mode. The historical scripts are already hard to access because few fonts and keyboards support them; the site should not add barriers of its own.

This document describes what we aim for, what we expect from contributions, how to tell us about a barrier, and what we know does not work well yet.

## Priorities

Our goal is that you can do the core tasks without help: type or paste text, convert it in either direction, copy or share the result, and use the on-screen alphabet and the history.

We work towards the [Web Content Accessibility Guidelines (WCAG) 2.2, level AA](https://www.w3.org/TR/WCAG22/). This is a goal, not a verified claim: the site has not been formally evaluated against WCAG.

What we focus on:

- **Keyboard:** everything can be reached and used with the keyboard, in a logical order, with a clearly visible focus. Open panels close with Escape and put the focus back where you were.
- **Screen readers:** buttons and text fields have names, the input and output fields carry the right language (Albanian in Latin, Elbasan, Vithkuqi or Todhri script) so screen readers can choose a suitable voice, and actions like copying or swapping are announced.
- **Seeing the screen:** text and controls have enough contrast in both light and dark mode, and feedback such as "copied" or an error never makes the page jump.
- **Small screens:** the layout works on phones; the on-screen alphabet opens inline instead of covering the text.

## Contributor expectations

Changes that affect what people see or do on the site must keep it at least as accessible as before. In particular:

- Everything new can be used with the keyboard and has a visible focus state.
- Buttons that only show an icon have an `aria-label`; external links say that they open in a new tab.
- Colors come from the design tokens in `src/app.css` and have enough contrast in light **and** dark mode.
- Visible feedback does not shift the layout; spoken feedback goes through the existing status region in `Transliterator.svelte`.
- Text in a script keeps its language tag (`sq-Elba`, `sq-Vith`, `sq-Todr`).

`npm run check` (also run in CI) includes the accessibility warnings of the Svelte compiler and must stay free of warnings. There is no automated accessibility test in CI yet, so please also check by hand: go through your change with the keyboard only, and with a screen reader if you can. In the pull request, say how you tested and add screenshots in light and dark mode for visual changes.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the general workflow.

## Reporting accessibility issues

If something on the site is hard or impossible for you to use, please tell us by [opening an issue](https://github.com/gjelbrim/shqipee/issues/new) with "accessibility" in the title.

Helpful, if you can share it:

- what you were trying to do and on which page (elbasan, vithkuqi or todhri)
- what happened and what you expected
- your browser and operating system
- assistive technology you use, such as a screen reader, screen magnifier, voice control or switch device, and its version

Screenshots or recordings are welcome but optional. You do not need to tell us about any disability, and you do not need to know technical terms; describing what happened is enough.

### Severity

We use these levels to decide what to fix first. You do not need to pick one; we assign it when we look at the report.

- **Critical:** you cannot complete a core task at all. Example: the output cannot be reached or copied with the keyboard, or the focus gets stuck in a panel.
- **High:** you can complete the task only with a lot of effort or outside help. Example: a button has no name for screen readers, or text is unreadable in dark mode.
- **Medium:** the task works but is confusing or slower than it should be. Example: an action is not announced, or the focus order is illogical.
- **Low:** a small annoyance that does not block anything. Example: a focus outline that is hard to see on one element.

### How we respond

This is a small project maintained in spare time, so we keep our promises modest:

- We reply to every report within **7 days**, confirm whether we can reproduce it and give it a severity.
- If there is a workaround, we tell you in the issue.
- Critical and high issues are fixed with priority, usually in the next release; we update the issue when the fix is live.
- You are welcome to check the fix and tell us whether it works for you before we close the issue.

## Ownership and maintenance

- **gjelbrim haskaj** (development) is responsible for accessibility in the code, reviews pull requests for it and triages accessibility issues.
- **franz anhäupl** (design) makes sure design changes keep contrast, readable text sizes and visible focus states.

We review this document and the known limitations before each release from `dev` to `main`. If responsibilities change, the new owner is named here in the same pull request.

## Supported environments

The site is built for current versions of Chrome, Edge, Firefox and Safari on desktop, Android and iOS, used with a mouse, keyboard or touch screen.

What has been tested so far:

- Chromium on desktop and in mobile emulation (phone widths down to 390 pixels): keyboard use, focus order, focus visibility, announcements and contrast in light and dark mode, plus automated checks with [axe-core](https://github.com/dequelabs/axe-core) on all three pages.

Not systematically tested yet: Firefox and Safari, real phones, and screen readers (such as NVDA, JAWS, VoiceOver and TalkBack), screen magnifiers and voice control. They should work, but we cannot confirm it. Reports from these setups are especially welcome.

## Known limitations

- **Screen readers cannot read the scripts aloud.** Elbasan, Vithkuqi and Todhri letters are usually announced as unknown characters, as their technical names or not at all. Workaround: the Latin text on the other side contains the same content; swap the direction to hear it.
- **Text in the scripts may show as empty boxes outside this site.** Few fonts support these scripts yet, so copied text may not display in other apps or for the people you send it to. The fonts used here are free (Noto Sans Elbasan, Noto Sans Vithkuqi, Noto Serif Todhri) and can be installed.
- **Caps lock in the Vithkuqi alphabet needs a quick double press or a long press** of the shift key. With a keyboard, press Enter or Space twice in quick succession on the shift key.
- **All interface text is lowercase** as part of the design, and the interface is only available in English.
- **Animations are small** (short hover and color transitions) but do not yet turn off when your system asks for reduced motion.

## Feedback and improvements

If you have ideas for making the site or this document more accessible, open an issue or a pull request; small wording fixes to this document are welcome as pull requests directly. If something blocks you right now, please use the reporting process above so it gets a severity and a response.
