# The Names of All Manner of Hounds

![GitHub Workflow Status](https://github.com/jazzsequence/all-manner-of-hounds/actions/workflows/test.yml/badge.svg)

![Medieval Image of houndis](https://cdn8.openculture.com/2022/11/24222653/Livre_de_Chasse_40v-1.jpg)

> Here begynnyth the names of all maner of houndis after the a.b.c. Firste to begynne with .a. for houndis names...

This project is based on the [Medieval manuscript shared by OpenCulture](https://www.openculture.com/2022/11/a-list-of-1065-medieval-dog-names-nosewise-garlik-havegoodday-more.html) that simply lists 1,065 dog names. No big woof. (yukka yukka)

The thought was, _what could be done with 1,065 medeival dog names?_ and the answer, of course, is always Dungeons & Dragons. Therefore, this project is to build/provide a TTRPG name generator that randomly chooses from these names for whatever purpose you may need it for.

### Notes
* In some cases, a name included a character that, as best as I can tell, is literally a numeral 3. According to [this document](https://sites.ualberta.ca/~sreimer/ms-course/course/eng-chrs.htm) (the only one I could find with a quick Google), this is a "yogh" and is basically the letter "g". Some of these characters were replaced with an "m" on a first pass before I found that information.
* In some cases, one or more characters is wrapped with `<` and `>` characters. I've left these in place as carets.
* The names are presented in the JSON file in as alphabetical an order as they were presented in the manuscript (which isn't strictly alphabetical, despite the note).

## TODO
* Finish transcribing names from OCR-read raw text file into json.
* Replace yogh characters represented with an "m" with "g" characters instead.
* Build a react app for the name generator
* Add styling to the app
* Build a WP plugin to display the random names? (possible future implementation)