import {Formatter, FormatterBuilder} from './formatter';
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
        let fmt = Formatter.Full;

        it("standard", () => {
            let value = new BigAmount(1500, units);
            expect(fmt.format(value)).toBe("1,500 Some");
        });

        it("zero", () => {
            let value = new BigAmount(0, units);
            expect(fmt.format(value)).toBe("0 Some");
        });

        it("negative", () => {
            let value = new BigAmount(-2345, units);
            expect(fmt.format(value)).toBe("-2,345 Some");
        });

        it("large", () => {
            let value = new BigAmount("1234567890123456", units);
            expect(fmt.format(value)).toBe("1,234,567,890,123,456 Some");
        });
    });

    describe("optimal code unit", () => {
        let fmt = Formatter.OptimalWithCode;

        it("standard", () => {
            let value = new BigAmount(1500, units);
            expect(fmt.format(value)).toBe("1.50 kS");
        });

        it("zero", () => {
            let value = new BigAmount(0, units);
            expect(fmt.format(value)).toBe("0.00 S");
        });

        it("negative", () => {
            let value = new BigAmount(-2345, units);
            expect(fmt.format(value)).toBe("-2.35 kS");
        });

        it("large", () => {
            let value = new BigAmount("1234567890123456", units);
            expect(fmt.format(value)).toBe("1,234,567,890.12 MS");
        });
    });

    describe("top code unit", () => {
        let fmt = new FormatterBuilder()
            .useTopUnit()
            .number(4)
            .append(" ")
            .unitCode()
            .build();

        it("standard", () => {
            let value = new BigAmount(121500, units);
            expect(fmt.format(value)).toBe("0.1215 MS");
        });


    });

})