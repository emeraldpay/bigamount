import {Formatter} from './formatter';
import {BigAmount} from "./amount";
import {Unit, Units} from "./units";

let units = new Units(
    [
        new Unit(0, "Some", "S"),
        new Unit(3, "Kilo Some", "kS"),
        new Unit(6, "Mega Some", "MS")
    ]
);

describe("Formatter", () => {

    describe("Full Formatter", () => {

        it("standard", () => {
            let fmt = Formatter.Full;
            let value = new BigAmount(1500, units);
            expect(fmt.format(value)).toBe("1,500 Mega Some");
        });

        it("zero", () => {
            let fmt = Formatter.Full;
            let value = new BigAmount(0, units);
            expect(fmt.format(value)).toBe("0 Mega Some");
        });

        it("negative", () => {
            let fmt = Formatter.Full;
            let value = new BigAmount(-2345, units);
            expect(fmt.format(value)).toBe("-2,345 Mega Some");
        });

        it("large", () => {
            let fmt = Formatter.Full;
            let value = new BigAmount("1234567890123456", units);
            expect(fmt.format(value)).toBe("1,234,567,890,123,456 Mega Some");
        });
    });

})