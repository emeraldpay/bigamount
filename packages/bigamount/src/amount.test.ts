import {Unit, Units} from "./units";
import {BigAmount, isEncodedAmount} from "./amount";
import BigNumber from "bignumber.js";

let units = new Units(
    [
        new Unit(0, "Some", "S"),
        new Unit(3, "Kilo Some", "kS"),
        new Unit(6, "Mega Some", "MS")
    ]
);
let units2 = new Units(
    [
        new Unit(0, "Some", "S"),
        new Unit(6, "Mega Some", "MS")
    ]
);


describe("BigAmount", () => {

    describe("Construct", () => {

        it("construct from string", () => {
            let value = new BigAmount("150", units);
            expect(value).toBeDefined();
            expect(value.number.toFixed()).toBe("150");
        });

        it("construct from negative string", () => {
            let value = new BigAmount("-23456", units);
            expect(value).toBeDefined();
            expect(value.number.toFixed()).toBe("-23456");
        });

        it("construct from number string", () => {
            let value = new BigAmount(150, units);
            expect(value).toBeDefined();
            expect(value.number.toFixed()).toBe("150");
        });

        it("construct from negative number string", () => {
            let value = new BigAmount(-150, units);
            expect(value).toBeDefined();
            expect(value.number.toFixed()).toBe("-150");
        });

        it("construct large from string", () => {
            let value = new BigAmount("9362285714285714298238", units);
            expect(value).toBeDefined();
            expect(value.number.toFixed()).toBe("9362285714285714298238");
        });

        it("construct from bignum", () => {
            let value = new BigAmount(new BigNumber("9362285714285714298238"), units);
            expect(value).toBeDefined();
            expect(value.number.toFixed()).toBe("9362285714285714298238");

        });

        it("construct from number with decimals", () => {
            let value = new BigAmount(new BigNumber("93622857.14285714298238"), units);
            expect(value).toBeDefined();
            expect(value.number.toFixed()).toBe("93622857");

            value = new BigAmount(93622857.14, units);
            expect(value).toBeDefined();
            expect(value.number.toFixed()).toBe("93622857");

            value = new BigAmount(93622857.54, units);
            expect(value).toBeDefined();
            expect(value.number.toFixed()).toBe("93622858");
        })

        it("construct from same", () => {
            let value = new BigAmount(new BigAmount("9362285714285714298238", units), units);
            expect(value).toBeDefined();
            expect(value.number.toFixed()).toBe("9362285714285714298238");
        });

    });

    describe("is", () => {
        it("for BigAmount", () => {
            expect(
                BigAmount.is(new BigAmount(150, units))
            ).toBeTruthy();
        });
        it("for string", () => {
            expect(
                BigAmount.is("150")
            ).toBeFalsy();
        });
        it("for bignum", () => {
            expect(
                BigAmount.is(new BigNumber(100))
            ).toBeFalsy();
        });
        it("for undefined", () => {
            expect(
                BigAmount.is(undefined)
            ).toBeFalsy();
        });
        it("for object", () => {
            expect(
                BigAmount.is({value: new BigNumber(100)})
            ).toBeFalsy();
        });
    });

    describe("isEncodedAmount", () => {
        it("for encoded", () => {
            expect(
                isEncodedAmount("9362285714285714298238/S")
            ).toBeTruthy();
            expect(
                isEncodedAmount("0/S")
            ).toBeTruthy();
            expect(
                isEncodedAmount(" 0/S ")
            ).toBeTruthy();
            expect(
                isEncodedAmount("-10/S")
            ).toBeTruthy();
        });
        it("for invalid", () => {
            expect(
                isEncodedAmount("value 936/S")
            ).toBeFalsy();
            expect(
                isEncodedAmount("936/S!")
            ).toBeFalsy();
            expect(
                isEncodedAmount("936 S")
            ).toBeFalsy();
            expect(
                isEncodedAmount("936S")
            ).toBeFalsy();
            expect(
                isEncodedAmount("936")
            ).toBeFalsy();
            expect(
                isEncodedAmount("")
            ).toBeFalsy();
            expect(
                isEncodedAmount(undefined)
            ).toBeFalsy();
            expect(
                isEncodedAmount(null)
            ).toBeFalsy();
        });

    })

    describe("get number by unit", () => {
        it("base", () => {
            let value = new BigAmount("123456", units);
            expect(value.getNumberByUnit(units.units[0]).toFixed()).toBe("123456");
        });
        it("kilo", () => {
            let value = new BigAmount("123456", units);
            expect(value.getNumberByUnit(units.units[1]).toFixed()).toBe("123.456");
        });
        it("mega", () => {
            let value = new BigAmount("123456", units);
            expect(value.getNumberByUnit(units.units[2]).toFixed()).toBe("0.123456");
        });
        it("error for undefined", () => {
            let value = new BigAmount("123456", units);
            expect(() => {
                value.getNumberByUnit(undefined).toFixed()
            }).toThrow();
        });
        it("error for different unit", () => {
            let value = new BigAmount("123456", units);
            expect(() => {
                value.getNumberByUnit(new Unit(6, "Other", "OT")).toFixed()
            }).toThrow();
        });
    });

    describe("get optimal unit", () => {
        // since it's a shortcut do just a basic check
        it("works", () => {
            let value = new BigAmount("123456", units);
            expect(value.getOptimalUnit().code).toBe("kS");
        })
    });

    describe("to string", () => {
        it("standard", () => {
            let value = new BigAmount("123456", units);
            expect(value.toString()).toBe("123.456 kS");
        });
        it("zero", () => {
            let value = new BigAmount(0, units);
            expect(value.toString()).toBe("0 S");
        });
    });

    describe("encode", () => {
        it("big value", () => {
            let value = new BigAmount("9362285714285714298238", units);
            expect(value.encode()).toBe("9362285714285714298238/S");
        });
        it("zero", () => {
            let value = new BigAmount(0, units);
            expect(value.encode()).toBe("0/S");
        });
        it("negative", () => {
            let value = new BigAmount(-123456, units);
            expect(value.encode()).toBe("-123456/S");
        });
    });

    describe("decode", () => {
        it("big value", () => {
            let decoded = BigAmount.decode("9362285714285714298238/S", units);
            expect(decoded).toBeDefined();
            expect(decoded.number.toFixed()).toBe("9362285714285714298238");
        });
        it("zero", () => {
            let decoded = BigAmount.decode("0/S", units);
            expect(decoded).toBeDefined();
            expect(decoded.number.toFixed()).toBe("0");
        });
        it("negative", () => {
            let decoded = BigAmount.decode("-321/S", units);
            expect(decoded).toBeDefined();
            expect(decoded.number.toFixed()).toBe("-321");
        });
        it("error to decode if non-number", () => {
            expect(() => {
                BigAmount.decode("foo/S", units)
            }).toThrow();
        });
        it("error to decode if characters after", () => {
            expect(() => {
                BigAmount.decode("100 foo/S", units)
            }).toThrow();
        });
        it("error to decode if characters before", () => {
            expect(() => {
                BigAmount.decode("foo 100/S", units)
            }).toThrow();
        });
        it("error to decode wrong format", () => {
            expect(() => {
                BigAmount.decode("100", units)
            }).toThrow();
        });
    });

    describe("equals", () => {
        it("equal to itself", () => {
            let value = new BigAmount("9362285714285714298238", units);
            expect(value.equals(value)).toBeTruthy();
        });
        it("equal to same", () => {
            let value = new BigAmount("1234", units);
            expect(value.equals(new BigAmount(1234, units))).toBeTruthy();
        });
        it("not equal to different unit", () => {
            let value = new BigAmount("1234", units);
            expect(value.equals(new BigAmount("1234", units2))).toBeFalsy();
        });
        it("not equal to different value", () => {
            let value = new BigAmount("1234", units);
            expect(value.equals(new BigAmount("5678", units))).toBeFalsy();
        });
        it("not equal to null", () => {
            let value = new BigAmount("1234", units);
            expect(value.equals(null)).toBeFalsy();
        });
        it("not equal to undefined", () => {
            let value = new BigAmount("1234", units);
            expect(value.equals(undefined)).toBeFalsy();
        });
        it("not equal to bignum", () => {
            let value = new BigAmount("1234", units);
            // @ts-ignore
            expect(value.equals(new BigNumber(1234))).toBeFalsy();
        });
        it("not equal to number", () => {
            let value = new BigAmount("1234", units);
            // @ts-ignore
            expect(value.equals(1234)).toBeFalsy();
        });
        it("not equal to string", () => {
            let value = new BigAmount("1234", units);
            // @ts-ignore
            expect(value.equals("1234")).toBeFalsy();
        });
    });

    describe("isSame", () => {
        it("same to itself", () => {
            let value = new BigAmount("9362285714285714298238", units);
            expect(value.isSame(value)).toBeTruthy();
        });
        it("same to exactly same", () => {
            let value = new BigAmount("1234", units);
            expect(value.isSame(new BigAmount(1234, units))).toBeTruthy();
        });
        it("same to same unit with different amount", () => {
            let value = new BigAmount("1234", units);
            expect(value.isSame(new BigAmount(5678, units))).toBeTruthy();
        });
        it("not same to different unit", () => {
            let value = new BigAmount(1234, units);
            expect(value.isSame(new BigAmount(1234, units2))).toBeFalsy();
        });
        it("not same to null", () => {
            let value = new BigAmount("1234", units);
            expect(value.isSame(null)).toBeFalsy();
        });
        it("not same to undefined", () => {
            let value = new BigAmount("1234", units);
            expect(value.isSame(undefined)).toBeFalsy();
        });
        it("not same to bignum", () => {
            let value = new BigAmount("1234", units);
            // @ts-ignore
            expect(value.isSame(new BigNumber(1234))).toBeFalsy();
        });
        it("not same to number", () => {
            let value = new BigAmount("1234", units);
            // @ts-ignore
            expect(value.isSame(1234)).toBeFalsy();
        });
        it("not same to string", () => {
            let value = new BigAmount("1234", units);
            // @ts-ignore
            expect(value.isSame("1234")).toBeFalsy();
        });
    });

    describe("math", () => {
        it("standard", () => {
            let value = new BigAmount("1234", units);
            value = value.plus(new BigAmount("101", units));
            expect(value.number.toFixed()).toBe("1335");
            value = value.minus(new BigAmount("1000", units));
            expect(value.number.toFixed()).toBe("335");
            value = value.multiply(2);
            expect(value.number.toFixed()).toBe("670");
            value = value.multiply(3);
            expect(value.number.toFixed()).toBe("2010");
            value = value.divide(2);
            expect(value.number.toFixed()).toBe("1005");
        });

        it("large", () => {
            let value = new BigAmount("9362285714285714298238", units);
            value = value.multiply(3);
            expect(value.number.toFixed()).toBe("28086857142857142894714");
            value = value.minus(new BigAmount("71668571428", units));
            expect(value.number.toFixed()).toBe("28086857142785474323286");
            value = value.divide(2);
            expect(value.number.toFixed()).toBe("14043428571392737161643");
        });

        it("with bignum", () => {
            let value = new BigAmount("9362285714285714298238", units);
            value = value.multiply(new BigNumber(123));
            expect(value.number.toFixed()).toBe("1151561142857142858683274");
        });

        it("decimal multiply", () => {
            let value = new BigAmount("93622857", units);
            value = value.multiply(3.123);
            expect(value.number.toFixed()).toBe("292384182");
        });

        it("decimal divide rounds to floor", () => {
            let value = new BigAmount("93622857", units);
            // 37449142.8
            expect(value.divide(2.5).number.toFixed()).toBe("37449142");
            // 36008791.153
            expect(value.divide(2.6).number.toFixed()).toBe("36008791");
        });

        it("cannot sum different units", () => {
            let value = new BigAmount("93622857", units);
            expect(() => {
                value.plus(new BigAmount("93622857", units2))
            }).toThrow();
        });

        it("cannot substract different units", () => {
            let value = new BigAmount("93622857", units);
            expect(() => {
                value.minus(new BigAmount("93622857", units2))
            }).toThrow();
        });
    });

    describe("checks", () => {
        it("1", () => {
            let value = new BigAmount(1, units);
            expect(value.isZero()).toBeFalsy();
            expect(value.isNegative()).toBeFalsy();
            expect(value.isPositive()).toBeTruthy();
        });
        it("101", () => {
            let value = new BigAmount(101, units);
            expect(value.isZero()).toBeFalsy();
            expect(value.isNegative()).toBeFalsy();
            expect(value.isPositive()).toBeTruthy();
        });
        it("0", () => {
            let value = new BigAmount(0, units);
            expect(value.isZero()).toBeTruthy();
            expect(value.isNegative()).toBeFalsy();
            expect(value.isPositive()).toBeFalsy();
        });
        it("-1", () => {
            let value = new BigAmount(-1, units);
            expect(value.isZero()).toBeFalsy();
            expect(value.isNegative()).toBeTruthy();
            expect(value.isPositive()).toBeFalsy();
        });
        it("-101", () => {
            let value = new BigAmount(-101, units);
            expect(value.isZero()).toBeFalsy();
            expect(value.isNegative()).toBeTruthy();
            expect(value.isPositive()).toBeFalsy();
        });
    })

    describe("comparison", () => {
        let value1 = new BigAmount(1, units);
        let value2 = new BigAmount(10, units);

        it("same", () => {
            expect(value1.isLessOrEqualTo(value1)).toBeTruthy();
            expect(value1.isLessThan(value1)).toBeFalsy();
            expect(value1.isGreaterOrEqualTo(value1)).toBeTruthy();
            expect(value1.isGreaterThan(value1)).toBeFalsy();
            expect(value1.compareTo(value1)).toBe(0);
        });

        it("different", () => {
            expect(value1.isLessOrEqualTo(value2)).toBeTruthy();
            expect(value1.isLessThan(value2)).toBeTruthy();
            expect(value1.isGreaterOrEqualTo(value2)).toBeFalsy();
            expect(value1.isGreaterThan(value2)).toBeFalsy();
            expect(value1.compareTo(value2)).toBe(-1);

            expect(value2.isLessOrEqualTo(value1)).toBeFalsy();
            expect(value2.isLessThan(value1)).toBeFalsy();
            expect(value2.isGreaterOrEqualTo(value1)).toBeTruthy();
            expect(value2.isGreaterThan(value1)).toBeTruthy();
            expect(value2.compareTo(value1)).toBe(1);
        });
    });

    describe("choose", () => {
        let value1 = new BigAmount(1, units);
        let value2 = new BigAmount(10, units);

        it("max", () => {
            let act = value1.max(value1);
            expect(act.number.toFixed()).toBe("1");

            act = value1.max(value2);
            expect(act.number.toFixed()).toBe("10");

            act = value2.max(value1);
            expect(act.number.toFixed()).toBe("10");

            act = value2.max(value2);
            expect(act.number.toFixed()).toBe("10");
        });

        it("min", () => {
            let act = value1.min(value1);
            expect(act.number.toFixed()).toBe("1");

            act = value1.min(value2);
            expect(act.number.toFixed()).toBe("1");

            act = value2.min(value1);
            expect(act.number.toFixed()).toBe("1");

            act = value2.min(value2);
            expect(act.number.toFixed()).toBe("10");
        });

    });

});