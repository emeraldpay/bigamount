import {Satoshi} from "./bitcoin";

describe("Satoshi", () => {
    describe("create", () => {
        it("from bitcoin shortcut", () => {
            let value = Satoshi.fromBitcoin(1.23);
            expect(value.number.toFixed()).toBe("123000000");
        });
    });

    describe("toBitcoin", () => {
        it("zero", () => {
            expect(
                Satoshi.ZERO.toBitcoin()
            ).toBe(0);
        });

        it("one", () => {
            expect(
                new Satoshi("100000000").toBitcoin()
            ).toBe(1);
        });

        it("decimal", () => {
            expect(
                new Satoshi("123400000").toBitcoin()
            ).toBe(1.234);
        });

    });
})