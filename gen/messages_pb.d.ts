// package: christiangeorgelucas.robotstxt_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class RobotsToolsError extends jspb.Message {
  getCode(): string;
  setCode(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RobotsToolsError.AsObject;
  static toObject(includeInstance: boolean, msg: RobotsToolsError): RobotsToolsError.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RobotsToolsError, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RobotsToolsError;
  static deserializeBinaryFromReader(message: RobotsToolsError, reader: jspb.BinaryReader): RobotsToolsError;
}

export namespace RobotsToolsError {
  export type AsObject = {
    code: string,
    message: string,
  }
}

export class RobotsDocument extends jspb.Message {
  getRobotsTxt(): string;
  setRobotsTxt(value: string): void;

  getSiteUrl(): string;
  setSiteUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RobotsDocument.AsObject;
  static toObject(includeInstance: boolean, msg: RobotsDocument): RobotsDocument.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RobotsDocument, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RobotsDocument;
  static deserializeBinaryFromReader(message: RobotsDocument, reader: jspb.BinaryReader): RobotsDocument;
}

export namespace RobotsDocument {
  export type AsObject = {
    robotsTxt: string,
    siteUrl: string,
  }
}

export class RobotsPathRule extends jspb.Message {
  getPath(): string;
  setPath(value: string): void;

  getLine(): number;
  setLine(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RobotsPathRule.AsObject;
  static toObject(includeInstance: boolean, msg: RobotsPathRule): RobotsPathRule.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RobotsPathRule, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RobotsPathRule;
  static deserializeBinaryFromReader(message: RobotsPathRule, reader: jspb.BinaryReader): RobotsPathRule;
}

export namespace RobotsPathRule {
  export type AsObject = {
    path: string,
    line: number,
  }
}

export class RobotsRuleGroup extends jspb.Message {
  clearUserAgentsList(): void;
  getUserAgentsList(): Array<string>;
  setUserAgentsList(value: Array<string>): void;
  addUserAgents(value: string, index?: number): string;

  clearAllowList(): void;
  getAllowList(): Array<RobotsPathRule>;
  setAllowList(value: Array<RobotsPathRule>): void;
  addAllow(value?: RobotsPathRule, index?: number): RobotsPathRule;

  clearDisallowList(): void;
  getDisallowList(): Array<RobotsPathRule>;
  setDisallowList(value: Array<RobotsPathRule>): void;
  addDisallow(value?: RobotsPathRule, index?: number): RobotsPathRule;

  getHasCrawlDelay(): boolean;
  setHasCrawlDelay(value: boolean): void;

  getCrawlDelay(): number;
  setCrawlDelay(value: number): void;

  getStartLine(): number;
  setStartLine(value: number): void;

  getEndLine(): number;
  setEndLine(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RobotsRuleGroup.AsObject;
  static toObject(includeInstance: boolean, msg: RobotsRuleGroup): RobotsRuleGroup.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RobotsRuleGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RobotsRuleGroup;
  static deserializeBinaryFromReader(message: RobotsRuleGroup, reader: jspb.BinaryReader): RobotsRuleGroup;
}

export namespace RobotsRuleGroup {
  export type AsObject = {
    userAgentsList: Array<string>,
    allowList: Array<RobotsPathRule.AsObject>,
    disallowList: Array<RobotsPathRule.AsObject>,
    hasCrawlDelay: boolean,
    crawlDelay: number,
    startLine: number,
    endLine: number,
  }
}

export class ParsedRobots extends jspb.Message {
  clearGroupsList(): void;
  getGroupsList(): Array<RobotsRuleGroup>;
  setGroupsList(value: Array<RobotsRuleGroup>): void;
  addGroups(value?: RobotsRuleGroup, index?: number): RobotsRuleGroup;

  clearSitemapsList(): void;
  getSitemapsList(): Array<string>;
  setSitemapsList(value: Array<string>): void;
  addSitemaps(value: string, index?: number): string;

  getPreferredHost(): string;
  setPreferredHost(value: string): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParsedRobots.AsObject;
  static toObject(includeInstance: boolean, msg: ParsedRobots): ParsedRobots.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParsedRobots, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParsedRobots;
  static deserializeBinaryFromReader(message: ParsedRobots, reader: jspb.BinaryReader): ParsedRobots;
}

export namespace ParsedRobots {
  export type AsObject = {
    groupsList: Array<RobotsRuleGroup.AsObject>,
    sitemapsList: Array<string>,
    preferredHost: string,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
  }
}

export class ParseRobotsInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): RobotsDocument | undefined;
  setDoc(value?: RobotsDocument): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseRobotsInput.AsObject;
  static toObject(includeInstance: boolean, msg: ParseRobotsInput): ParseRobotsInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseRobotsInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseRobotsInput;
  static deserializeBinaryFromReader(message: ParseRobotsInput, reader: jspb.BinaryReader): ParseRobotsInput;
}

export namespace ParseRobotsInput {
  export type AsObject = {
    doc?: RobotsDocument.AsObject,
  }
}

export class ParseRobotsOutput extends jspb.Message {
  hasResult(): boolean;
  clearResult(): void;
  getResult(): ParsedRobots | undefined;
  setResult(value?: ParsedRobots): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseRobotsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ParseRobotsOutput): ParseRobotsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseRobotsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseRobotsOutput;
  static deserializeBinaryFromReader(message: ParseRobotsOutput, reader: jspb.BinaryReader): ParseRobotsOutput;
}

export namespace ParseRobotsOutput {
  export type AsObject = {
    result?: ParsedRobots.AsObject,
  }
}

export class CheckAccessInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): RobotsDocument | undefined;
  setDoc(value?: RobotsDocument): void;

  getUrl(): string;
  setUrl(value: string): void;

  getUserAgent(): string;
  setUserAgent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckAccessInput.AsObject;
  static toObject(includeInstance: boolean, msg: CheckAccessInput): CheckAccessInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckAccessInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckAccessInput;
  static deserializeBinaryFromReader(message: CheckAccessInput, reader: jspb.BinaryReader): CheckAccessInput;
}

export namespace CheckAccessInput {
  export type AsObject = {
    doc?: RobotsDocument.AsObject,
    url: string,
    userAgent: string,
  }
}

export class CheckAccessOutput extends jspb.Message {
  getAllowed(): boolean;
  setAllowed(value: boolean): void;

  getMatched(): boolean;
  setMatched(value: boolean): void;

  getMatchedLine(): number;
  setMatchedLine(value: number): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  getDisallowed(): boolean;
  setDisallowed(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckAccessOutput.AsObject;
  static toObject(includeInstance: boolean, msg: CheckAccessOutput): CheckAccessOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckAccessOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckAccessOutput;
  static deserializeBinaryFromReader(message: CheckAccessOutput, reader: jspb.BinaryReader): CheckAccessOutput;
}

export namespace CheckAccessOutput {
  export type AsObject = {
    allowed: boolean,
    matched: boolean,
    matchedLine: number,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
    disallowed: boolean,
  }
}

export class GetCrawlDelayInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): RobotsDocument | undefined;
  setDoc(value?: RobotsDocument): void;

  getUserAgent(): string;
  setUserAgent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCrawlDelayInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetCrawlDelayInput): GetCrawlDelayInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCrawlDelayInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCrawlDelayInput;
  static deserializeBinaryFromReader(message: GetCrawlDelayInput, reader: jspb.BinaryReader): GetCrawlDelayInput;
}

export namespace GetCrawlDelayInput {
  export type AsObject = {
    doc?: RobotsDocument.AsObject,
    userAgent: string,
  }
}

export class GetCrawlDelayOutput extends jspb.Message {
  getCrawlDelay(): number;
  setCrawlDelay(value: number): void;

  getHasValue(): boolean;
  setHasValue(value: boolean): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCrawlDelayOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GetCrawlDelayOutput): GetCrawlDelayOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCrawlDelayOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCrawlDelayOutput;
  static deserializeBinaryFromReader(message: GetCrawlDelayOutput, reader: jspb.BinaryReader): GetCrawlDelayOutput;
}

export namespace GetCrawlDelayOutput {
  export type AsObject = {
    crawlDelay: number,
    hasValue: boolean,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
  }
}

export class ListUserAgentsInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): RobotsDocument | undefined;
  setDoc(value?: RobotsDocument): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListUserAgentsInput.AsObject;
  static toObject(includeInstance: boolean, msg: ListUserAgentsInput): ListUserAgentsInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListUserAgentsInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListUserAgentsInput;
  static deserializeBinaryFromReader(message: ListUserAgentsInput, reader: jspb.BinaryReader): ListUserAgentsInput;
}

export namespace ListUserAgentsInput {
  export type AsObject = {
    doc?: RobotsDocument.AsObject,
  }
}

export class ListUserAgentsOutput extends jspb.Message {
  clearUserAgentsList(): void;
  getUserAgentsList(): Array<string>;
  setUserAgentsList(value: Array<string>): void;
  addUserAgents(value: string, index?: number): string;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListUserAgentsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ListUserAgentsOutput): ListUserAgentsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListUserAgentsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListUserAgentsOutput;
  static deserializeBinaryFromReader(message: ListUserAgentsOutput, reader: jspb.BinaryReader): ListUserAgentsOutput;
}

export namespace ListUserAgentsOutput {
  export type AsObject = {
    userAgentsList: Array<string>,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
  }
}

export class ExtractRobotsSitemapUrlsInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): RobotsDocument | undefined;
  setDoc(value?: RobotsDocument): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractRobotsSitemapUrlsInput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractRobotsSitemapUrlsInput): ExtractRobotsSitemapUrlsInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractRobotsSitemapUrlsInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractRobotsSitemapUrlsInput;
  static deserializeBinaryFromReader(message: ExtractRobotsSitemapUrlsInput, reader: jspb.BinaryReader): ExtractRobotsSitemapUrlsInput;
}

export namespace ExtractRobotsSitemapUrlsInput {
  export type AsObject = {
    doc?: RobotsDocument.AsObject,
  }
}

export class ExtractRobotsSitemapUrlsOutput extends jspb.Message {
  clearSitemapUrlsList(): void;
  getSitemapUrlsList(): Array<string>;
  setSitemapUrlsList(value: Array<string>): void;
  addSitemapUrls(value: string, index?: number): string;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractRobotsSitemapUrlsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractRobotsSitemapUrlsOutput): ExtractRobotsSitemapUrlsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractRobotsSitemapUrlsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractRobotsSitemapUrlsOutput;
  static deserializeBinaryFromReader(message: ExtractRobotsSitemapUrlsOutput, reader: jspb.BinaryReader): ExtractRobotsSitemapUrlsOutput;
}

export namespace ExtractRobotsSitemapUrlsOutput {
  export type AsObject = {
    sitemapUrlsList: Array<string>,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
  }
}

export class ListDisallowedPathsInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): RobotsDocument | undefined;
  setDoc(value?: RobotsDocument): void;

  getUserAgent(): string;
  setUserAgent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDisallowedPathsInput.AsObject;
  static toObject(includeInstance: boolean, msg: ListDisallowedPathsInput): ListDisallowedPathsInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListDisallowedPathsInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDisallowedPathsInput;
  static deserializeBinaryFromReader(message: ListDisallowedPathsInput, reader: jspb.BinaryReader): ListDisallowedPathsInput;
}

export namespace ListDisallowedPathsInput {
  export type AsObject = {
    doc?: RobotsDocument.AsObject,
    userAgent: string,
  }
}

export class ListDisallowedPathsOutput extends jspb.Message {
  clearPathsList(): void;
  getPathsList(): Array<string>;
  setPathsList(value: Array<string>): void;
  addPaths(value: string, index?: number): string;

  getMatchedGroupUserAgent(): string;
  setMatchedGroupUserAgent(value: string): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDisallowedPathsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ListDisallowedPathsOutput): ListDisallowedPathsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListDisallowedPathsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDisallowedPathsOutput;
  static deserializeBinaryFromReader(message: ListDisallowedPathsOutput, reader: jspb.BinaryReader): ListDisallowedPathsOutput;
}

export namespace ListDisallowedPathsOutput {
  export type AsObject = {
    pathsList: Array<string>,
    matchedGroupUserAgent: string,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
  }
}

export class GetEffectiveRuleGroupInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): RobotsDocument | undefined;
  setDoc(value?: RobotsDocument): void;

  getUserAgent(): string;
  setUserAgent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEffectiveRuleGroupInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetEffectiveRuleGroupInput): GetEffectiveRuleGroupInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetEffectiveRuleGroupInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEffectiveRuleGroupInput;
  static deserializeBinaryFromReader(message: GetEffectiveRuleGroupInput, reader: jspb.BinaryReader): GetEffectiveRuleGroupInput;
}

export namespace GetEffectiveRuleGroupInput {
  export type AsObject = {
    doc?: RobotsDocument.AsObject,
    userAgent: string,
  }
}

export class GetEffectiveRuleGroupOutput extends jspb.Message {
  hasGroup(): boolean;
  clearGroup(): void;
  getGroup(): RobotsRuleGroup | undefined;
  setGroup(value?: RobotsRuleGroup): void;

  getFound(): boolean;
  setFound(value: boolean): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEffectiveRuleGroupOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GetEffectiveRuleGroupOutput): GetEffectiveRuleGroupOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetEffectiveRuleGroupOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEffectiveRuleGroupOutput;
  static deserializeBinaryFromReader(message: GetEffectiveRuleGroupOutput, reader: jspb.BinaryReader): GetEffectiveRuleGroupOutput;
}

export namespace GetEffectiveRuleGroupOutput {
  export type AsObject = {
    group?: RobotsRuleGroup.AsObject,
    found: boolean,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
  }
}

export class GetPreferredHostInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): RobotsDocument | undefined;
  setDoc(value?: RobotsDocument): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPreferredHostInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetPreferredHostInput): GetPreferredHostInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetPreferredHostInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPreferredHostInput;
  static deserializeBinaryFromReader(message: GetPreferredHostInput, reader: jspb.BinaryReader): GetPreferredHostInput;
}

export namespace GetPreferredHostInput {
  export type AsObject = {
    doc?: RobotsDocument.AsObject,
  }
}

export class GetPreferredHostOutput extends jspb.Message {
  getHost(): string;
  setHost(value: string): void;

  getHasValue(): boolean;
  setHasValue(value: boolean): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPreferredHostOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GetPreferredHostOutput): GetPreferredHostOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetPreferredHostOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPreferredHostOutput;
  static deserializeBinaryFromReader(message: GetPreferredHostOutput, reader: jspb.BinaryReader): GetPreferredHostOutput;
}

export namespace GetPreferredHostOutput {
  export type AsObject = {
    host: string,
    hasValue: boolean,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
  }
}

export class GetMatchingLineInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): RobotsDocument | undefined;
  setDoc(value?: RobotsDocument): void;

  getUrl(): string;
  setUrl(value: string): void;

  getUserAgent(): string;
  setUserAgent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMatchingLineInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetMatchingLineInput): GetMatchingLineInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetMatchingLineInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMatchingLineInput;
  static deserializeBinaryFromReader(message: GetMatchingLineInput, reader: jspb.BinaryReader): GetMatchingLineInput;
}

export namespace GetMatchingLineInput {
  export type AsObject = {
    doc?: RobotsDocument.AsObject,
    url: string,
    userAgent: string,
  }
}

export class GetMatchingLineOutput extends jspb.Message {
  getLine(): number;
  setLine(value: number): void;

  getMatched(): boolean;
  setMatched(value: boolean): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMatchingLineOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GetMatchingLineOutput): GetMatchingLineOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetMatchingLineOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMatchingLineOutput;
  static deserializeBinaryFromReader(message: GetMatchingLineOutput, reader: jspb.BinaryReader): GetMatchingLineOutput;
}

export namespace GetMatchingLineOutput {
  export type AsObject = {
    line: number,
    matched: boolean,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
  }
}

export class SitemapDocument extends jspb.Message {
  getXml(): string;
  setXml(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SitemapDocument.AsObject;
  static toObject(includeInstance: boolean, msg: SitemapDocument): SitemapDocument.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SitemapDocument, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SitemapDocument;
  static deserializeBinaryFromReader(message: SitemapDocument, reader: jspb.BinaryReader): SitemapDocument;
}

export namespace SitemapDocument {
  export type AsObject = {
    xml: string,
  }
}

export class SitemapUrlEntry extends jspb.Message {
  getLoc(): string;
  setLoc(value: string): void;

  getLastmod(): string;
  setLastmod(value: string): void;

  getChangefreq(): string;
  setChangefreq(value: string): void;

  getPriority(): number;
  setPriority(value: number): void;

  getHasPriority(): boolean;
  setHasPriority(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SitemapUrlEntry.AsObject;
  static toObject(includeInstance: boolean, msg: SitemapUrlEntry): SitemapUrlEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SitemapUrlEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SitemapUrlEntry;
  static deserializeBinaryFromReader(message: SitemapUrlEntry, reader: jspb.BinaryReader): SitemapUrlEntry;
}

export namespace SitemapUrlEntry {
  export type AsObject = {
    loc: string,
    lastmod: string,
    changefreq: string,
    priority: number,
    hasPriority: boolean,
  }
}

export class ParseSitemapInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): SitemapDocument | undefined;
  setDoc(value?: SitemapDocument): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseSitemapInput.AsObject;
  static toObject(includeInstance: boolean, msg: ParseSitemapInput): ParseSitemapInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseSitemapInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseSitemapInput;
  static deserializeBinaryFromReader(message: ParseSitemapInput, reader: jspb.BinaryReader): ParseSitemapInput;
}

export namespace ParseSitemapInput {
  export type AsObject = {
    doc?: SitemapDocument.AsObject,
  }
}

export class ParseSitemapOutput extends jspb.Message {
  clearUrlsList(): void;
  getUrlsList(): Array<SitemapUrlEntry>;
  setUrlsList(value: Array<SitemapUrlEntry>): void;
  addUrls(value?: SitemapUrlEntry, index?: number): SitemapUrlEntry;

  getCount(): number;
  setCount(value: number): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseSitemapOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ParseSitemapOutput): ParseSitemapOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseSitemapOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseSitemapOutput;
  static deserializeBinaryFromReader(message: ParseSitemapOutput, reader: jspb.BinaryReader): ParseSitemapOutput;
}

export namespace ParseSitemapOutput {
  export type AsObject = {
    urlsList: Array<SitemapUrlEntry.AsObject>,
    count: number,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
  }
}

export class SitemapIndexEntry extends jspb.Message {
  getLoc(): string;
  setLoc(value: string): void;

  getLastmod(): string;
  setLastmod(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SitemapIndexEntry.AsObject;
  static toObject(includeInstance: boolean, msg: SitemapIndexEntry): SitemapIndexEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SitemapIndexEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SitemapIndexEntry;
  static deserializeBinaryFromReader(message: SitemapIndexEntry, reader: jspb.BinaryReader): SitemapIndexEntry;
}

export namespace SitemapIndexEntry {
  export type AsObject = {
    loc: string,
    lastmod: string,
  }
}

export class ParseSitemapIndexInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): SitemapDocument | undefined;
  setDoc(value?: SitemapDocument): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseSitemapIndexInput.AsObject;
  static toObject(includeInstance: boolean, msg: ParseSitemapIndexInput): ParseSitemapIndexInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseSitemapIndexInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseSitemapIndexInput;
  static deserializeBinaryFromReader(message: ParseSitemapIndexInput, reader: jspb.BinaryReader): ParseSitemapIndexInput;
}

export namespace ParseSitemapIndexInput {
  export type AsObject = {
    doc?: SitemapDocument.AsObject,
  }
}

export class ParseSitemapIndexOutput extends jspb.Message {
  clearSitemapsList(): void;
  getSitemapsList(): Array<SitemapIndexEntry>;
  setSitemapsList(value: Array<SitemapIndexEntry>): void;
  addSitemaps(value?: SitemapIndexEntry, index?: number): SitemapIndexEntry;

  getCount(): number;
  setCount(value: number): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseSitemapIndexOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ParseSitemapIndexOutput): ParseSitemapIndexOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseSitemapIndexOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseSitemapIndexOutput;
  static deserializeBinaryFromReader(message: ParseSitemapIndexOutput, reader: jspb.BinaryReader): ParseSitemapIndexOutput;
}

export namespace ParseSitemapIndexOutput {
  export type AsObject = {
    sitemapsList: Array<SitemapIndexEntry.AsObject>,
    count: number,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
  }
}

export class DetectSitemapTypeInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): SitemapDocument | undefined;
  setDoc(value?: SitemapDocument): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetectSitemapTypeInput.AsObject;
  static toObject(includeInstance: boolean, msg: DetectSitemapTypeInput): DetectSitemapTypeInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetectSitemapTypeInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetectSitemapTypeInput;
  static deserializeBinaryFromReader(message: DetectSitemapTypeInput, reader: jspb.BinaryReader): DetectSitemapTypeInput;
}

export namespace DetectSitemapTypeInput {
  export type AsObject = {
    doc?: SitemapDocument.AsObject,
  }
}

export class DetectSitemapTypeOutput extends jspb.Message {
  getDocType(): string;
  setDocType(value: string): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetectSitemapTypeOutput.AsObject;
  static toObject(includeInstance: boolean, msg: DetectSitemapTypeOutput): DetectSitemapTypeOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetectSitemapTypeOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetectSitemapTypeOutput;
  static deserializeBinaryFromReader(message: DetectSitemapTypeOutput, reader: jspb.BinaryReader): DetectSitemapTypeOutput;
}

export namespace DetectSitemapTypeOutput {
  export type AsObject = {
    docType: string,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
  }
}

export class CountSitemapUrlsInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): SitemapDocument | undefined;
  setDoc(value?: SitemapDocument): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CountSitemapUrlsInput.AsObject;
  static toObject(includeInstance: boolean, msg: CountSitemapUrlsInput): CountSitemapUrlsInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CountSitemapUrlsInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CountSitemapUrlsInput;
  static deserializeBinaryFromReader(message: CountSitemapUrlsInput, reader: jspb.BinaryReader): CountSitemapUrlsInput;
}

export namespace CountSitemapUrlsInput {
  export type AsObject = {
    doc?: SitemapDocument.AsObject,
  }
}

export class CountSitemapUrlsOutput extends jspb.Message {
  getCount(): number;
  setCount(value: number): void;

  getDocType(): string;
  setDocType(value: string): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CountSitemapUrlsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: CountSitemapUrlsOutput): CountSitemapUrlsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CountSitemapUrlsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CountSitemapUrlsOutput;
  static deserializeBinaryFromReader(message: CountSitemapUrlsOutput, reader: jspb.BinaryReader): CountSitemapUrlsOutput;
}

export namespace CountSitemapUrlsOutput {
  export type AsObject = {
    count: number,
    docType: string,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
  }
}

export class ExtractSitemapLocsInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): SitemapDocument | undefined;
  setDoc(value?: SitemapDocument): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractSitemapLocsInput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractSitemapLocsInput): ExtractSitemapLocsInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractSitemapLocsInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractSitemapLocsInput;
  static deserializeBinaryFromReader(message: ExtractSitemapLocsInput, reader: jspb.BinaryReader): ExtractSitemapLocsInput;
}

export namespace ExtractSitemapLocsInput {
  export type AsObject = {
    doc?: SitemapDocument.AsObject,
  }
}

export class ExtractSitemapLocsOutput extends jspb.Message {
  clearLocsList(): void;
  getLocsList(): Array<string>;
  setLocsList(value: Array<string>): void;
  addLocs(value: string, index?: number): string;

  getDocType(): string;
  setDocType(value: string): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): RobotsToolsError | undefined;
  setError(value?: RobotsToolsError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractSitemapLocsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractSitemapLocsOutput): ExtractSitemapLocsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractSitemapLocsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractSitemapLocsOutput;
  static deserializeBinaryFromReader(message: ExtractSitemapLocsOutput, reader: jspb.BinaryReader): ExtractSitemapLocsOutput;
}

export namespace ExtractSitemapLocsOutput {
  export type AsObject = {
    locsList: Array<string>,
    docType: string,
    ok: boolean,
    error?: RobotsToolsError.AsObject,
  }
}

