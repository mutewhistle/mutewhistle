import {
	NativeModulesProxy,
	EventEmitter,
	Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to MwcModule.web.ts
// and on native platforms to MwcModule.ts
import MwcModule from "./src/MwcModule";
import MwcModuleView from "./src/MwcModuleView";
import { ChangeEventPayload, MwcModuleViewProps } from "./src/MwcModule.types";

// Get the native constant value.
export const PI = MwcModule.PI;

export function hello(): string {
	return MwcModule.hello();
}

export function initWallet(password: string) {
	return MwcModule.getTestString(password, password);
}

export function rustAuthenticate(user: string, password: string): Promise<string> {
	// Call the Swift function using the native module wrapper
	return MwcModule.getTestString(user, password);
}

export async function setValueAsync(value: string) {
	return await MwcModule.setValueAsync(value);
}

const emitter = new EventEmitter(MwcModule ?? NativeModulesProxy.MwcModule);

export function addChangeListener(
	listener: (event: ChangeEventPayload) => void
): Subscription {
	return emitter.addListener<ChangeEventPayload>("onChange", listener);
}

export { MwcModuleView, MwcModuleViewProps, ChangeEventPayload };
