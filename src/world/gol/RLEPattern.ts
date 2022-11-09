import {Vector2} from "three";

class RLEPattern {
    public name: string;
    public comment: string;
    public author: string;
    public columns: number = 0;
    public rows: number = 0;
    public seed: Vector2[] = [];

    /**
     *
     * @param content
     */
    constructor(content: string) {
        this.name = "";
        this.comment = "";
        this.author = "";
        const lines = content.split(new RegExp("\\n|\\r|\\n\\r|\\r\\n", "gm"));

        let rleData: string = "";
        for (let i = 0; i < lines.length; i++) {
            const firstChar = lines[i].charAt(0);

            switch (firstChar.toLowerCase()) {
                case '#':
                    this.parseMetaData(lines[i]);
                    break;
                case 'x':
                    this.parseHeader(lines[i]);
                    break;
                default:
                    rleData += this.verifyRLE(lines[i]);
            }
        }

        this.parseRLE(rleData);
    }

    /**
     * C = comment
     * N = Name
     * O = Author
     * @param metaDataLine
     * @private
     */
    private parseMetaData(metaDataLine: string) {
        let secondChar = metaDataLine.charAt(1);
        switch (secondChar) {
            case 'C':
                this.comment += ((this.comment.length>0) ? " " : "") + this.getLineContent(metaDataLine, 2);
                break;
            case 'N':
                this.name += ((this.name.length>0) ? " " : "") + this.getLineContent(metaDataLine, 2);
                break;
            case 'O':
                this.author += ((this.author.length>0) ? " " : "") + this.getLineContent(metaDataLine, 2);
                break;
        }
    }

    private getLineContent(line: string, start: number) {
        return line.substring(start).trim();
    }

    /**
     * x = 8, y = 8, rule = B3/S23
     * @param header
     * @private
     */
    private parseHeader(header: string) {
        let matches = new RegExp("^x\\s*=\\s*(\\d+)\\s*,\\s*y\\s*=\\s*(\\d+)", "gi").exec(header);

        if (matches) {
            if (matches.length >= 2) {
                this.columns = parseInt(matches[1]);
            }

            if (matches.length >= 3) {
                this.rows = parseInt(matches[2]);
            }
        }
    }

    private verifyRLE(rleData: string) {
        let matches = rleData.match(new RegExp("(\\d|b|o|\\$|\\!)+", "gi"));
        if (matches && matches.length > 0) {
            return rleData.trim();
        }
        return "";
    }

    /**
     * 22ob
     * obo
     * bo!
     * O O X
     * O X O
     * X O X
     *
     * 2
     * o
     * b
     *
     * v(0,0), v(1,0)
     *
     * RegEx to split row data into multiplyer and operator char b | o
     * ((\d)*(b|o))
     * Group 1 = Multiplyer+Operator
     * Group 2 = Multiplyer | Empty
     * Group 3 = Operator b|o
     * @param rleData
     * @private
     */
    private parseRLE(rleData: string) {
        let dataRows = rleData.toLowerCase().split('$');

        for (let y = 0; y < this.rows; y++) {
            if (y < dataRows.length) {
                let chars = dataRows[y].split('');
                let x = 0;
                let step = 1;

                for (let i = 0; i < chars.length; i++) {
                    if (!isNaN(Number(chars[i]))) {
                        [i, step] = RLEPattern.calculateSteps(i, chars);
                    }
                    if (chars[i] == "o") {
                        for (let j = 0; j < step; j++) {
                            this.seed.push(new Vector2(x, y));
                            x++;
                        }
                        step = 1;
                    }
                    if (chars[i] == 'b') {
                        for (let j = 0; j < step; j++) {
                            x++;
                        }
                        step = 1;
                    }
                }
            }
        }
    }

    private static calculateSteps(i: number, chars: string[]): [number, number] {
        let numStr = chars[i];
        let step = 0;

        i++;
        while (!isNaN(Number(chars[i]))) {
            numStr += chars[i];
            i++
        }

        step = Number(numStr);

        return [i,step];
    }
}

export { RLEPattern };