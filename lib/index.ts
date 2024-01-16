type BunCheckOptions = {
	desiredVersion?: string;
	error?: ({ message }: { message: string }) => void;
};
export const bunCheck = (opts?: BunCheckOptions) => {
	let message = "";
	const bunVersion = process.versions.bun;

	if (!bunVersion) {
		message = "Bun runtime not found";
		if (opts?.error) {
			opts.error({ message });
			return;
		}

		throw new Error(message);
	}

	if (opts?.desiredVersion) {
		const { semver } = require("bun");
		const satisfies = semver.satisfies(bunVersion, opts.desiredVersion);

		if (!satisfies) {
			message = `Bun version ${bunVersion} does not satisfy desired semver ${opts.desiredVersion}`;

			if (opts.error) {
				opts.error({ message });
				return;
			}

			throw new Error(message);
		}
	}
};

export default bunCheck;
