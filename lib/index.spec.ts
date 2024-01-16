import { afterEach, beforeAll, describe, expect, it, mock } from "bun:test";
import { bunCheck } from "./index";

// biome-ignore lint/suspicious/noExplicitAny: required for testing
let oldProcess: any;
const errorMock = mock(() => {});

const errorMessages = {
	noBun: "Bun runtime not found",
	semver: (bunVersion: string, desiredVersion: string) =>
		`Bun version ${bunVersion} does not satisfy desired semver ${desiredVersion}`,
};

beforeAll(() => {
	oldProcess = { ...process };
});

afterEach(() => {
	global.process = oldProcess;
	errorMock.mockClear();
});

describe("index.ts", () => {
	describe("meta", () => {
		it("exports correctly", async () => {
			const defaultImport = (await import("./index")).default;

			expect(defaultImport).toStrictEqual(bunCheck);
		});
	});
	describe("bunCheck", () => {
		it("does not throw if in bun and no desiredVersion set", () => {
			expect(bunCheck).not.toThrow();
		});
		it("does not call error cb if in bun and no desiredVersion set", () => {
			bunCheck({ error: errorMock });

			expect(errorMock).not.toHaveBeenCalled();
		});
		it("does not throw if bun available and semver satisfies", () => {
			global.process = { ...process, versions: { ...process.versions, bun: "9000.0.1" } };

			expect(() => bunCheck({ desiredVersion: "^9000.0.0" })).not.toThrow();
		});
		it("does not call error cb if in bun and no desiredVersion set", () => {
			global.process = { ...process, versions: { ...process.versions, bun: "9900.0.5" } };

			bunCheck({ desiredVersion: "~9900.0.1", error: errorMock });

			expect(errorMock).not.toHaveBeenCalled();
		});
		it("throws error if bun not available", () => {
			global.process = { ...process, versions: { ...process.versions, bun: undefined as unknown as string } };

			expect(bunCheck).toThrow(errorMessages.noBun);
		});
		it("calls error cb if bun not available", () => {
			global.process = { ...process, versions: { ...process.versions, bun: undefined as unknown as string } };

			bunCheck({ error: errorMock });

			expect(errorMock).toHaveBeenCalledWith({ message: errorMessages.noBun });
		});
		it("throws error if bun semver not satisfied", () => {
			const bunVersion = "9980.1.0";
			const desiredVersion = ">=9992.0.0";
			global.process = { ...process, versions: { ...process.versions, bun: bunVersion } };

			expect(() => bunCheck({ desiredVersion })).toThrow(errorMessages.semver(bunVersion, desiredVersion));
		});
		it("calls error cb if bun semver not satisfied", () => {
			const bunVersion = "9990.1.0";
			const desiredVersion = "~9991.0.0";
			global.process = { ...process, versions: { ...process.versions, bun: bunVersion } };

			bunCheck({ desiredVersion, error: errorMock });

			expect(errorMock).toHaveBeenCalledWith({ message: errorMessages.semver(bunVersion, desiredVersion) });
		});
	});
});
