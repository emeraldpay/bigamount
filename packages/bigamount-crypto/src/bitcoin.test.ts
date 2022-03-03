import {BitcoinFormatter, Satoshi, SATOSHIS} from "./bitcoin";
import {BigAmount, Formatter, FormatterBuilder, Predicates} from "@emeraldpay/bigamount";

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

    describe("Format bitcoins", () => {
        let fmt = BitcoinFormatter;

        it("zero", () => {
            let value = Satoshi.ZERO;
            expect(fmt.format(value)).toBe("0 BTC");
        });

        it("one", () => {
            let value = new Satoshi("100000000");
            expect(fmt.format(value)).toBe("1 BTC");
        });

        it("decimal", () => {
            let value = new Satoshi("123400000");
            expect(fmt.format(value)).toBe("1.234 BTC");
        });

        it("less that bitcoin amount", () => {
            let value = new Satoshi("123456");
            expect(fmt.format(value)).toBe("0.001 BTC");
        });

        it("micro bitcoin amount", () => {
            let value = new Satoshi("12345");
            expect(fmt.format(value)).toBe("0.123 mBTC");

            value = new Satoshi("123");
            expect(fmt.format(value)).toBe("0.001 mBTC");
        });

        it("sat amount", () => {
            let value = new Satoshi("2");
            expect(fmt.format(value)).toBe("2 sat");
        });
    });


    describe("encoding", () => {
        it("decode encoder", () => {
            [119, 7194, 1291854, 13084, 7453181, 65, 756921399].forEach((n) => {
                let orig = new Satoshi(n);
                let encoded = orig.encode();
                let decoded = Satoshi.decode(encoded);
                expect(orig.equals(decoded)).toBeTruthy();
                expect(Satoshi.is(decoded)).toBeTruthy();
            })
        });

        it("encode", () => {
            let value = Satoshi.fromBitcoin(1.23);
            expect(value.encode()).toBe("123000000/SAT");
        });

        it("decode", () => {
            let value = Satoshi.decode("123000000/SAT");
            expect(value.number.toFixed()).toBe("123000000");
        })
    });

    describe("operations returns Satoishi", () => {
        let act = Satoshi.ZERO.plus(Satoshi.ZERO);
        expect(
            act.isSame(Satoshi.ZERO)
        ).toBeTruthy();
        expect(
            Satoshi.is(act)
        ).toBeTruthy();
    });

})