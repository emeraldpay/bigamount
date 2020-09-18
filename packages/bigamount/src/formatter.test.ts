import {Formatter, FormatterBuilder, NumberFormatter} from './formatter';
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
            expect(fmt.format(value)).toBe("1.5 kS");
        });

        it("zero", () => {
            let value = new BigAmount(0, units);
            expect(fmt.format(value)).toBe("0 S");
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

    describe("decimals", () => {

        it("remove trailing zeroes", () => {
            let fmt = new FormatterBuilder()
                .useOptimalUnit()
                .number(4, true)
                .append(" ")
                .unitCode()
                .build();
            let value = new BigAmount(1500, units);
            expect(fmt.format(value)).toBe("1.5 kS");
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

    describe("NumberFormatter", () => {
        it("stripDecimalZero", () => {
            let fmt = new NumberFormatter();
            expect(fmt.stripDecimalZero("1.200")).toBe("1.2");
            expect(fmt.stripDecimalZero("1.20")).toBe("1.2");
            expect(fmt.stripDecimalZero("1.0")).toBe("1");
            expect(fmt.stripDecimalZero("1.012030")).toBe("1.01203");
            expect(fmt.stripDecimalZero("1.0120300000")).toBe("1.01203");
            expect(fmt.stripDecimalZero("1.0000")).toBe("1");
        })
    });

})