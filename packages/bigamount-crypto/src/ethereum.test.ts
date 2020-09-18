import {Wei} from "./ethereum";

describe("Ethereum ETH", () => {
    describe("create", () => {
        it("from bitcoin shortcut", () => {
            let value = Wei.fromEther(1.23);
            expect(value.number.toFixed()).toBe("1230000000000000000");
        });
    });

    describe("encoding", () => {
        it("decode encoder", () => {
            [119, 7194, 1291854, 13084, 7453181, 65, 756921399].forEach((n) => {
                let orig = new Wei(n);
                let encoded = orig.encode();
                let decoded = Wei.decode(encoded);
                expect(orig.equals(decoded)).toBeTruthy();
                expect(Wei.is(decoded)).toBeTruthy();
            })
        });
    });
});
