export const TREE_ARRAY = [
    {
        label: "Bilder",
        parent: null,
        child: [
            {
                label: "Katzen",
                parent: "Bilder",
                child: [
                    {
                        label: "Katze1",
                        parent: "Katzen",
                        child: "https://www.kindernetz.de/wissen/tierlexikon/1655279778114,steckbrief-katze-102~_v-16x9@2dL_-6c42aff4e68b43c7868c3240d3ebfa29867457da.jpg",
                    },
                    {
                        label: "Katze2.png",
                        parent: "Katzen",
                        child: "https://www.planet-wissen.de/natur/haustiere/katzen/katzen-intro-102~_v-HintergrundL.jpg",
                    },
                    {
                        label: "Österreich",
                        parent: "Katzen",
                        child: [],
                    },
                ],
            },
            {
                label: "Hunde",
                parent: "Bilder",
                child: [
                    {
                        label: "Hund1.png",
                        parent: "Hunde",
                        child: "www.Hund1.at",
                    },
                    {
                        label: "Hund2.png",
                        parent: "Hunde",
                        child: "www.Hund2.at",
                    },
                ],
            },
        ],
    },
    {
        label: "Dokumente",
        parent: null,
        child: [],
    },
];