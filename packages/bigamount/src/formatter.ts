import {BigAmount} from "./amount";
import BigNumber from "bignumber.js";
import {Unit} from "./units";
import RoundingMode = BigNumber.RoundingMode;

export interface FormattingContext {
    source: BigAmount,
    buffer: string[]
    number: BigNumber;
    unit: Unit;
}

export interface FormatterPart {
    apply(ctx: FormattingContext);
}

export class BigAmountFormatter {
    readonly formatters: FormatterPart[]

    constructor(formatters: FormatterPart[]) {
        this.formatters = formatters;
    }

    format(value: BigAmount): string {
        let ctx: FormattingContext = {
            source: value,
            buffer: [],
            number: value.number,
            unit: value.units.base
        }
        this.formatters.forEach((fmt) => fmt.apply(ctx));
        return ctx.buffer.join("")
    }
}

export class FormatterBuilder {
    private formatter: FormatterPart[] = []

    number(decimals?: number, removeTailing: boolean = false, rounding?: BigNumber.RoundingMode, format?: BigNumber.Format): FormatterBuilder {
        this.formatter.push(
            new NumberFormatter(decimals, removeTailing, rounding, format)
        );
        return this;
    }

    append(s: string): FormatterBuilder {
        this.formatter.push(
            new AppendFormatter(s)
        )
        return this;
    }

    useUnit(unit: Unit): FormatterBuilder {
        this.formatter.push(
            new UseUnit(unit)
        )
        return this;
    }

    useOptimalUnit(limit?: Unit): FormatterBuilder {
        this.formatter.push(
            new OptimalUnit(limit)
        )
        return this;
    }

    useBaseUnit(): FormatterBuilder {
        this.formatter.push(
            new BaseUnit()
        )
        return this;
    }

    useTopUnit(): FormatterBuilder {
        this.formatter.push(
            new TopUnit()
        )
        return this;
    }

    unitName(): FormatterBuilder {
        this.formatter.push(
            new UnitNameFormatter()
        )
        return this;
    }

    unitCode(): FormatterBuilder {
        this.formatter.push(
            new UnitCodeFormatter()
        )
        return this;
    }

    build(): BigAmountFormatter {
        return new BigAmountFormatter(this.formatter);
    }
}

export class NumberFormatter implements FormatterPart {
    readonly decimals: number = 0;
    readonly rounding: RoundingMode | undefined;
    readonly format: BigNumber.Format | undefined;
    readonly removeTrailing: boolean;

    constructor(decimals: number | undefined = 0,
                removeTailing: boolean = false,
                rounding: BigNumber.RoundingMode | undefined = undefined,
                format: BigNumber.Format | undefined = undefined) {
        this.decimals = decimals;
        this.removeTrailing = removeTailing;
        this.rounding = rounding;
        this.format = format;
    }

    apply(ctx: FormattingContext) {
        let number = ctx.number.toFormat(this.decimals, this.rounding, this.format);
        if (this.removeTrailing) {
            number = this.stripDecimalZero(number)
        }
        ctx.buffer.push(number)
    }

    stripDecimalZero(snum: string): string {
        let decimalsStart = snum.indexOf(".");
        if (decimalsStart <= 0) {
            return snum
        }
        let end = snum.length;
        let numberFound = false;
        for (let i = snum.length - 1; !numberFound && i >= decimalsStart; i--) {
            let c = snum[i];
            if (c !== "0" && c !== ".") {
                numberFound = true;
            } else {
                end = i;
            }
        }
        return snum.substring(0, end)
    }
}

export class AppendFormatter implements FormatterPart {
    readonly str: string;

    constructor(str: string) {
        this.str = str;
    }

    apply(ctx: FormattingContext) {
        ctx.buffer.push(this.str);
    }
}


export class UnitCodeFormatter implements FormatterPart {
    apply(ctx: FormattingContext) {
        ctx.buffer.push(
            ctx.unit.code
        )
    }
}

export class UnitNameFormatter implements FormatterPart {
    apply(ctx: FormattingContext) {
        ctx.buffer.push(
            ctx.unit.name
        )
    }
}

export class UseUnit implements FormatterPart {
    readonly unit: Unit;

    constructor(unit: Unit) {
        this.unit = unit;
    }

    apply(ctx: FormattingContext) {
        if (!ctx.source.units.contains(this.unit)) {
            throw new Error("Unsupported unit: " + this.unit);
        }
        ctx.unit = this.unit;
    }
}

export class BaseUnit implements FormatterPart {
    apply(ctx: FormattingContext) {
        ctx.unit = ctx.source.units.base;
    }
}

export class TopUnit implements FormatterPart {
    apply(ctx: FormattingContext) {
        ctx.unit = ctx.source.units.top;
        ctx.number = ctx.source.getNumberByUnit(ctx.unit);
    }
}

export class OptimalUnit implements FormatterPart {
    readonly limit: Unit | undefined;

    constructor(limit: Unit | undefined) {
        this.limit = limit;
    }

    apply(ctx: FormattingContext) {
        ctx.unit = ctx.source.getOptimalUnit(this.limit);
        ctx.number = ctx.source.getNumberByUnit(ctx.unit);
    }
}

export const DefaultFormatterParts = {
    OptimalUnit, BaseUnit, TopUnit, UseUnit, UnitCodeFormatter, UnitNameFormatter, NumberFormatter, AppendFormatter
}

const Amount = new FormatterBuilder()
    .number()
    .build();

const Full = new FormatterBuilder()
    .number()
    .append(" ")
    .unitName()
    .build();

const FullWithCode = new FormatterBuilder()
    .number()
    .append(" ")
    .unitCode()
    .build();

const OptimalWithCode = new FormatterBuilder()
    .useOptimalUnit()
    .number(2, true)
    .append(" ")
    .unitCode()
    .build();

export const Formatter = {
    Amount, Full, FullWithCode, OptimalWithCode
}