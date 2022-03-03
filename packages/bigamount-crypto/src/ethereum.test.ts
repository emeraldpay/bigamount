import {EthereumFormatter, Wei, WeiEtc} from "./ethereum";
import {BitcoinFormatter, Satoshi} from "./bitcoin";

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

    describe("operations returns ETH", () => {
        let act = Wei.ZERO.plus(Wei.ZERO);
        expect(
            act.isSame(Wei.ZERO)
        ).toBeTruthy();
        expect(
            Wei.is(act)
        ).toBeTruthy();
    });
});

describe("Ethereum ETC", () => {

    describe("operations returns ETC", () => {
        let act = WeiEtc.ZERO.plus(WeiEtc.ZERO);
        expect(
            act.isSame(WeiEtc.ZERO)
        ).toBeTruthy();
        expect(
            WeiEtc.is(act)
        ).toBeTruthy();
    });

});

describe("Format ETH", () => {
    let fmt = EthereumFormatter;

    it("zero", () => {
        let value = Wei.ZERO;
        expect(fmt.format(value)).toBe("0 ETH");
    });

    it("one", () => {
        let value = new Wei("1000000000000000000");
        expect(fmt.format(value)).toBe("1 ETH");
    });

    it("decimal", () => {
        let value = new Wei("1234000000000000000");
        expect(fmt.format(value)).toBe("1.234 ETH");
    });

    it("less that ether amount", () => {
        let value = new Wei("234000000000000000");
        expect(fmt.format(value)).toBe("0.234 ETH");

        value = new Wei("899123456789123456");
        expect(fmt.format(value)).toBe("0.899 ETH");

        value = new Wei("89123456789123456");
        expect(fmt.format(value)).toBe("0.089 ETH");

        value = new Wei("8123456789123456");
        expect(fmt.format(value)).toBe("0.008 ETH");
    });

    it("small amount", () => {
        let value = new Wei("123");
        expect(fmt.format(value)).toBe("123 Wei");

        value = new Wei("2");
        expect(fmt.format(value)).toBe("2 Wei");
    });

});