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

    describe("get unit", () => {
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
            expect(units.getUnit(1, units.units[1]).code).toBe("kS")
            expect(units.getUnit(100, units.units[1]).code).toBe("kS")
            expect(units.getUnit(1050, units.units[1]).code).toBe("kS")
            expect(units.getUnit(2_510_050, units.units[1]).code).toBe("MS")
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