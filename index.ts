import { minamo } from "./minamo.js";
import chords from "./chords.json";

const keys = [ "c","cs","d","ds","e","f","fs","g","gs","a","as","b", ];

export module PianoChordsChart
{
    const makeHeading = (tag: string, text: string) =>
    (
        {
            tag,
            children: text,
        }
    );
    const makeDisplayName = (key: string, suffix: string) =>
        `${key.substr(0,1).toUpperCase()}${key.endsWith("s") ? "#": ""}${suffix}`;
    const renderKey = (key: string, mark?: boolean) =>
    ({
        tag: "div",
        className: ["key", key, true === mark ? "mark": ""].filter(i => "" !== i).join(" "),
        onclick: undefined !== mark ? undefined: () => eval("this.classList.toggle('mark')"),
    });
    const renderOctave = (level: number = 0, chord?: number[]) =>
    ({
        tag: "div",
        className: ["octave", 0 < level ? "high": ""].filter(i => "" !== i).join(" "),
        children: keys.map
        (
            (i, index) => renderKey
            (
                i,
                undefined === chord ?
                    undefined:
                    chord.some(x => x === (level *12) +index)
            )
        )
    });
    export const start = async (): Promise<void> =>
    {
        const getChord = (chordDiv: HTMLDivElement) =>
        {
            const chord: number[] = [];
            Array.from(chordDiv.getElementsByClassName("key")).forEach
            (
                (i, index) =>
                {
                    if (i.classList.contains("mark"))
                    {
                        chord.push(index);
                    }
                }
            );
            return chord;
        };
        const filter = () =>
        {
            const chord = getChord(keysFilter);
            const value = textFilter.value.trim();
            Array.from(document.getElementsByClassName("chord")).forEach
            (
                i =>
                {
                    const iChord = getChord(<HTMLDivElement>i);
                    (<HTMLDivElement>i).style.display =
                    (
                        0 <= (<HTMLDivElement>i.getElementsByClassName("name")[0]).innerText.indexOf(value) &&
                        chord.filter(key => iChord.indexOf(key) < 0).length <= 0
                    )
                    ?
                        "inline-flex":
                        "none";
                }
            );
        };
        const keysFilter = minamo.dom.make(HTMLDivElement)
        ({
            className: "keys",
            onclick: filter,
            children:
            [
                renderOctave(0),
                renderOctave(1),
            ],
        });
        const textFilter = minamo.dom.make(HTMLInputElement)
        (
            {
                className: "filter",
                placeholder: "filter",
                oninput: filter
            }
        );
        minamo.dom.appendChildren
        (
            document.body,
            [
                makeHeading("h1", document.title),
                {
                    tag: "a",
                    className: "github",
                    children: "GitHub",
                    href: "https://github.com/wraith13/piano-chords-chart"
                },
                {
                    tag: "div",
                    className: "filter-panel",
                    children:
                    [
                        keysFilter,
                        textFilter,
                    ],
                },
                keys.map
                (
                    (key, index) => chords.map
                    (
                        entry =>
                        ({
                            tag: "div",
                            className: "chord",
                            children:
                            [
                                {
                                    tag: "div",
                                    className: "name",
                                    children: makeDisplayName(key, entry.suffix),
                                },
                                {
                                    tag: "div",
                                    className: "keys",
                                    children:
                                    [
                                        renderOctave(0, entry.chord.map(i => (i +index) %24)),
                                        renderOctave(1, entry.chord.map(i => (i +index) %24)),
                                    ],
                                }
                            ],
                        })
                    )
                ),
            ]
        );
    };
}
