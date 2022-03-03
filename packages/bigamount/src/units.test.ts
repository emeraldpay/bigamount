import {Unit, Units} from "./units";
import {BigAmount} from "./amount";

let units = new Units(
    [
        new Unit(0, "Some", "S"),
        new Unit(3, "Kilo Some", "kS"),
        new Unit(6, "Mega Some", "MS")
    ]
);

describe("Units", () => {

    describe("get optimal unit", () => {
        it("base for zero", () => {
            expect(units.getUnit(0).code).toBe("S")
        });

        it("first unit", () => {
            expect(units.getUnit(1).code).toBe("S")
            expect(units.getUnit(10).code).toBe("S")
            expect(units.getUnit(75).code).toBe("S")
            expect(units.getUnit(100).code).toBe("S")
            expect(units.getUnit(999).code).toBe("S")
        });

        it("second unit", () => {
            expect(units.getUnit(1000).code).toBe("kS")
            expect(units.getUnit(10_000).code).toBe("kS")
            expect(units.getUnit(56_700).code).toBe("kS")
            expect(units.getUnit(100_000).code).toBe("kS")
            expect(units.getUnit(999_000).code).toBe("kS")
        });

        it("third unit", () => {
            expect(units.getUnit(1_000_000).code).toBe("MS")
            expect(units.getUnit(2_000_000).code).toBe("MS")
            expect(units.getUnit(100_000_000).code).toBe("MS")
            expect(units.getUnit(1_000_000_000).code).toBe("MS")
        });

        it("negative value", () => {
            expect(units.getUnit(-1).code).toBe("S")
            expect(units.getUnit(-23).code).toBe("S")
            expect(units.getUnit(-105).code).toBe("S")
            expect(units.getUnit(-1000).code).toBe("kS")
            expect(units.getUnit(-10_000).code).toBe("kS")
            expect(units.getUnit(-190_000).code).toBe("kS")
            expect(units.getUnit(-990_000).code).toBe("kS")
            expect(units.getUnit(-1_000_000).code).toBe("MS")
            expect(units.getUnit(-2_500_000).code).toBe("MS")
        });

        it("with limit", () => {
            expect(units.getUnit(1, undefined, undefined, 3).code).toBe("kS")
            expect(units.getUnit(50, undefined, undefined, 3).code).toBe("kS")
            expect(units.getUnit(100, undefined, undefined, 3).code).toBe("kS")
        });

        it("with decimals", () => {
            expect(units.getUnit(1, units.units[1]).code).toBe("kS")
            expect(units.getUnit(100, units.units[1]).code).toBe("kS")
            expect(units.getUnit(1050, units.units[1]).code).toBe("kS")
            expect(units.getUnit(2_510_050, units.units[1]).code).toBe("MS")
        })

        it("with provided units", () => {
            let units = new Units(
                [
                    new Unit(0, "Some", "S"), // use
                    new Unit(3, "Kilosome", "kS"),
                    new Unit(6, "Megasome", "MS"),
                    new Unit(9, "Gigasome", "GS"), // use
                    new Unit(12, "Terasome", "TS"),
                    new Unit(15, "Pegasome", "PS"), // use
                ]
            );

            let useUnits = [units.units[0], units.units[3], units.units[5]]

            expect(units.getUnit(50).code).toBe("S");
            expect(units.getUnit(50, undefined, useUnits).code).toBe("S");
            expect(units.getUnit(1000).code).toBe("kS");
            expect(units.getUnit(1000, undefined, useUnits).code).toBe("S");
            expect(units.getUnit(200_000).code).toBe("kS");
            expect(units.getUnit(200_000, undefined, useUnits).code).toBe("S");
            expect(units.getUnit(100_000_000).code).toBe("MS");
            expect(units.getUnit(100_000_000, undefined, useUnits).code).toBe("S");
            expect(units.getUnit(1_000_000_000).code).toBe("GS");
            expect(units.getUnit(1_000_000_000, undefined, useUnits).code).toBe("GS");
            expect(units.getUnit(10_000_000_000).code).toBe("GS");
            expect(units.getUnit(10_000_000_000, undefined, useUnits).code).toBe("GS");
            expect(units.getUnit(1_000_000_000_000).code).toBe("TS");
            expect(units.getUnit(1_000_000_000_000, undefined, useUnits).code).toBe("GS");
            expect(units.getUnit(1_000_000_000_000_000).code).toBe("PS");
            expect(units.getUnit(1_000_000_000_000_000, undefined, useUnits).code).toBe("PS");
        })
    });

    describe("config", () => {
        it("top", () => {
            expect(units.top.code).toBe("MS");
        });
        it("base", () => {
            expect(units.base.code).toBe("S");
        });
    });
});