import {Satoshi} from "./bitcoin";

describe("Satoshi", () => {
    describe("create", () => {
        it("from bitcoin shortcut", () => {
            let value = Satoshi.fromBitcoin(1.23);
            expect(value.number.toFixed()).toBe("123000000");
        });
    })
})