"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// var network_1 = require("./network");
// var queries_1 = require("./queries");
// var error_1 = require("./error");
// var types_1 = require("./types");
// var utils_1 = require("./utils");
// var _1 = require(".");
// var constant_1 = require("./constant");
// var crypto_1 = require("./crypto");
import * as crypto_1  from 'crypto'
var CyberConnect = /** @class */ (function () {
    function CyberConnect(config) {
        this.address = '';
        this.signature = '';
        this.chain = types_1.Blockchain.ETH;
        this.chainRef = '';
        this.provider = null;
        this.signingMessageEntity = '';
        var provider = config.provider, namespace = config.namespace, env = config.env, chainRef = config.chainRef, chain = config.chain, signingMessageEntity = config.signingMessageEntity;
        if (!namespace) {
            throw new error_1.ConnectError(error_1.ErrorCode.EmptyNamespace);
        }
        this.chainId = env === _1.Env.PRODUCTION ? 56 : 97;
        this.namespace = namespace;
        this.endpoint = network_1.endpoints[env || _1.Env.PRODUCTION];
        this.chain = chain || types_1.Blockchain.ETH;
        this.chainRef = chainRef || '';
        this.provider = provider;
        this.signingMessageEntity = signingMessageEntity;
        delete window.localStorage[constant_1.C_ACCESS_TOKEN_KEY];
    }
    CyberConnect.prototype.getAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.address) {
                            return [2 /*return*/, this.address];
                        }
                        _a = this;
                        return [4 /*yield*/, (0, utils_1.getAddressByProvider)(this.provider, this.chain)];
                    case 1: return [2 /*return*/, (_a.address = _b.sent())];
                }
            });
        });
    };
    CyberConnect.prototype.authWithSigningKey = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var publicKey, acknowledgement, message, _c, signingKeySignature, resp, e_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, crypto_1.hasSigningKey)(this.address)];
                    case 1:
                        if (_d.sent()) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, (0, crypto_1.getPublicKey)(this.address)];
                    case 2:
                        publicKey = _d.sent();
                        acknowledgement = "I authorize ".concat(this.signingMessageEntity || 'CyberConnect', " from this device using signing key:\n");
                        message = "".concat(acknowledgement).concat(publicKey);
                        _c = this;
                        return [4 /*yield*/, this.getAddress()];
                    case 3:
                        _c.address = _d.sent();
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 9, , 10]);
                        return [4 /*yield*/, (0, utils_1.getSigningKeySignature)(this.provider, this.chain, message, this.address)];
                    case 5:
                        signingKeySignature = _d.sent();
                        if (!signingKeySignature) return [3 /*break*/, 7];
                        return [4 /*yield*/, (0, queries_1.registerSigningKey)({
                                address: this.address,
                                signature: signingKeySignature,
                                message: message,
                                url: this.endpoint.cyberConnectApi,
                            })];
                    case 6:
                        resp = _d.sent();
                        if (((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.registerSigningKey.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.registerSigningKey.result);
                        }
                        return [3 /*break*/, 8];
                    case 7: throw new Error('signingKeySignature is empty');
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        e_1 = _d.sent();
                        (0, crypto_1.clearSigningKeyByAddress)(this.address);
                        throw new Error('User cancel the sign process');
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.retryFollow = function (handle, ts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp, e_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getFollowRequestParams(handle, ts)];
                    case 1:
                        params = _c.sent();
                        return [4 /*yield*/, (0, queries_1.follow)(params, this.endpoint.cyberConnectApi)];
                    case 2:
                        resp = _c.sent();
                        if (((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.follow.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, 'Retry follow with ts from server failed:' +
                                ((_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.follow.status));
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _c.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, e_2.message || e_2);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.getHandleWithoutSuffix = function (handle) {
        return handle.split('.')[0];
    };
    CyberConnect.prototype.getFollowRequestParams = function (handle, ts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, message, signature, publicKey, params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getAddress()];
                    case 1:
                        _a.address = _b.sent();
                        return [4 /*yield*/, this.authWithSigningKey()];
                    case 2:
                        _b.sent();
                        message = {
                            op: 'follow',
                            address: this.address,
                            handle: this.getHandleWithoutSuffix(handle),
                            ts: ts || Date.now(),
                        };
                        return [4 /*yield*/, (0, crypto_1.signWithSigningKey)(JSON.stringify(message), this.address)];
                    case 3:
                        signature = _b.sent();
                        return [4 /*yield*/, (0, crypto_1.getPublicKey)(this.address)];
                    case 4:
                        publicKey = _b.sent();
                        params = {
                            address: this.address,
                            handle: handle,
                            message: JSON.stringify(message),
                            signature: signature,
                            signingKey: publicKey,
                        };
                        return [2 /*return*/, params];
                }
            });
        });
    };
    CyberConnect.prototype.follow = function (handle) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp, e_3;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.getFollowRequestParams(handle)];
                    case 1:
                        params = _g.sent();
                        return [4 /*yield*/, (0, queries_1.follow)(params, this.endpoint.cyberConnectApi)];
                    case 2:
                        resp = _g.sent();
                        if (!(((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.follow.status) === 'INVALID_SIGNATURE')) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, crypto_1.clearSigningKey)()];
                    case 3:
                        _g.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.follow.status);
                    case 4:
                        if (!(((_c = resp === null || resp === void 0 ? void 0 : resp.data) === null || _c === void 0 ? void 0 : _c.follow.status) === 'MESSAGE_EXPIRED')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.retryFollow(handle, (_d = resp === null || resp === void 0 ? void 0 : resp.data) === null || _d === void 0 ? void 0 : _d.follow.tsInServer)];
                    case 5:
                        _g.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        if (((_e = resp === null || resp === void 0 ? void 0 : resp.data) === null || _e === void 0 ? void 0 : _e.follow.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_f = resp === null || resp === void 0 ? void 0 : resp.data) === null || _f === void 0 ? void 0 : _f.follow.status);
                        }
                        _g.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        e_3 = _g.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, e_3.message || e_3);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.getUnfollowRequestParams = function (handle, ts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, message, signature, publicKey, params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getAddress()];
                    case 1:
                        _a.address = _b.sent();
                        return [4 /*yield*/, this.authWithSigningKey()];
                    case 2:
                        _b.sent();
                        message = {
                            op: 'unfollow',
                            address: this.address,
                            handle: this.getHandleWithoutSuffix(handle),
                            ts: ts || Date.now(),
                        };
                        return [4 /*yield*/, (0, crypto_1.signWithSigningKey)(JSON.stringify(message), this.address)];
                    case 3:
                        signature = _b.sent();
                        return [4 /*yield*/, (0, crypto_1.getPublicKey)(this.address)];
                    case 4:
                        publicKey = _b.sent();
                        params = {
                            address: this.address,
                            handle: handle,
                            message: JSON.stringify(message),
                            signature: signature,
                            signingKey: publicKey,
                        };
                        return [2 /*return*/, params];
                }
            });
        });
    };
    CyberConnect.prototype.retryUnfollow = function (handle, ts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getUnfollowRequestParams(handle, ts)];
                    case 1:
                        params = _c.sent();
                        return [4 /*yield*/, (0, queries_1.unfollow)(params, this.endpoint.cyberConnectApi)];
                    case 2:
                        resp = _c.sent();
                        if (((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.unfollow.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, 'Retry unfollow with ts from server failed:' +
                                ((_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.unfollow.status));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.unfollow = function (handle) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp, e_4;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.getUnfollowRequestParams(handle)];
                    case 1:
                        params = _g.sent();
                        return [4 /*yield*/, (0, queries_1.unfollow)(params, this.endpoint.cyberConnectApi)];
                    case 2:
                        resp = _g.sent();
                        if (!(((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.unfollow.status) === 'INVALID_SIGNATURE')) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, crypto_1.clearSigningKey)()];
                    case 3:
                        _g.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.unfollow.status);
                    case 4:
                        if (!(((_c = resp === null || resp === void 0 ? void 0 : resp.data) === null || _c === void 0 ? void 0 : _c.unfollow.status) === 'MESSAGE_EXPIRED')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.retryUnfollow(handle, (_d = resp === null || resp === void 0 ? void 0 : resp.data) === null || _d === void 0 ? void 0 : _d.unfollow.tsInServer)];
                    case 5:
                        _g.sent();
                        _g.label = 6;
                    case 6:
                        if (((_e = resp === null || resp === void 0 ? void 0 : resp.data) === null || _e === void 0 ? void 0 : _e.unfollow.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_f = resp === null || resp === void 0 ? void 0 : resp.data) === null || _f === void 0 ? void 0 : _f.unfollow.status);
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        e_4 = _g.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, e_4.message || e_4);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.createPost = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.publishPost(content)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CyberConnect.prototype.updatePost = function (id, content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.publishPost(__assign(__assign({}, content), { id: id }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CyberConnect.prototype.retryLike = function (contentId, ts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getReactParams(contentId, 'like', ts)];
                    case 1:
                        params = _c.sent();
                        return [4 /*yield*/, (0, queries_1.like)(params, this.endpoint.cyberConnectApi)];
                    case 2:
                        resp = _c.sent();
                        if (((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.like.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, 'Retry with ts from server failed: ' + ((_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.like.status));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.like = function (contentId) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp, e_5;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _j.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.getReactParams(contentId, 'like')];
                    case 1:
                        params = _j.sent();
                        return [4 /*yield*/, (0, queries_1.like)(params, this.endpoint.cyberConnectApi)];
                    case 2:
                        resp = _j.sent();
                        if (((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.like.status) === 'SUCCESS') {
                            return [2 /*return*/, (_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.like];
                        }
                        if (!(((_c = resp === null || resp === void 0 ? void 0 : resp.data) === null || _c === void 0 ? void 0 : _c.like.status) === 'INVALID_SIGNATURE')) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, crypto_1.clearSigningKey)()];
                    case 3:
                        _j.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_d = resp === null || resp === void 0 ? void 0 : resp.data) === null || _d === void 0 ? void 0 : _d.like.status);
                    case 4:
                        if (!(((_e = resp === null || resp === void 0 ? void 0 : resp.data) === null || _e === void 0 ? void 0 : _e.like.status) === 'MESSAGE_EXPIRED')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.retryLike(contentId, (_f = resp === null || resp === void 0 ? void 0 : resp.data) === null || _f === void 0 ? void 0 : _f.like.tsInServer)];
                    case 5:
                        _j.sent();
                        _j.label = 6;
                    case 6:
                        if (((_g = resp === null || resp === void 0 ? void 0 : resp.data) === null || _g === void 0 ? void 0 : _g.like.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_h = resp === null || resp === void 0 ? void 0 : resp.data) === null || _h === void 0 ? void 0 : _h.like.status);
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        e_5 = _j.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, e_5.message || e_5);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.retryDislike = function (contentId, ts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getReactParams(contentId, 'dislike', ts)];
                    case 1:
                        params = _c.sent();
                        return [4 /*yield*/, (0, queries_1.dislike)(params, this.endpoint.cyberConnectApi)];
                    case 2:
                        resp = _c.sent();
                        if (((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.dislike.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, 'Retry dislike with ts from server failed: ' +
                                ((_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.dislike.status));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.dislike = function (contentId) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp, e_6;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _j.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.getReactParams(contentId, 'dislike')];
                    case 1:
                        params = _j.sent();
                        return [4 /*yield*/, (0, queries_1.dislike)(params, this.endpoint.cyberConnectApi)];
                    case 2:
                        resp = _j.sent();
                        if (((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.dislike.status) === 'SUCCESS') {
                            return [2 /*return*/, (_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.dislike.status];
                        }
                        if (!(((_c = resp === null || resp === void 0 ? void 0 : resp.data) === null || _c === void 0 ? void 0 : _c.dislike.status) === 'INVALID_SIGNATURE')) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, crypto_1.clearSigningKey)()];
                    case 3:
                        _j.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_d = resp === null || resp === void 0 ? void 0 : resp.data) === null || _d === void 0 ? void 0 : _d.dislike.status);
                    case 4:
                        if (!(((_e = resp === null || resp === void 0 ? void 0 : resp.data) === null || _e === void 0 ? void 0 : _e.dislike.status) === 'MESSAGE_EXPIRED')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.retryDislike(contentId, (_f = resp === null || resp === void 0 ? void 0 : resp.data) === null || _f === void 0 ? void 0 : _f.dislike.tsInServer)];
                    case 5:
                        _j.sent();
                        _j.label = 6;
                    case 6:
                        if (((_g = resp === null || resp === void 0 ? void 0 : resp.data) === null || _g === void 0 ? void 0 : _g.dislike.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_h = resp === null || resp === void 0 ? void 0 : resp.data) === null || _h === void 0 ? void 0 : _h.dislike.status);
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        e_6 = _j.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, e_6.message || e_6);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.retryCancelReaction = function (contentId, ts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getReactParams(contentId, 'cancel', ts)];
                    case 1:
                        params = _c.sent();
                        return [4 /*yield*/, (0, queries_1.cancelLike)(params, this.endpoint.cyberConnectApi)];
                    case 2:
                        resp = _c.sent();
                        if (((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.cancelLike.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, 'Retry cancel like with fs from server failed: ' +
                                ((_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.dislike.status));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.cancelReaction = function (contentId) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp, e_7;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _j.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.getReactParams(contentId, 'cancel')];
                    case 1:
                        params = _j.sent();
                        return [4 /*yield*/, (0, queries_1.cancelLike)(params, this.endpoint.cyberConnectApi)];
                    case 2:
                        resp = _j.sent();
                        if (((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.cancelLike.status) === 'SUCCESS') {
                            return [2 /*return*/, (_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.cancelLike.status];
                        }
                        if (!(((_c = resp === null || resp === void 0 ? void 0 : resp.data) === null || _c === void 0 ? void 0 : _c.cancelLike.status) === 'INVALID_SIGNATURE')) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, crypto_1.clearSigningKey)()];
                    case 3:
                        _j.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_d = resp === null || resp === void 0 ? void 0 : resp.data) === null || _d === void 0 ? void 0 : _d.dislike.status);
                    case 4:
                        if (!(((_e = resp === null || resp === void 0 ? void 0 : resp.data) === null || _e === void 0 ? void 0 : _e.cancelLike.status) === 'MESSAGE_EXPIRED')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.retryCancelReaction(contentId, (_f = resp === null || resp === void 0 ? void 0 : resp.data) === null || _f === void 0 ? void 0 : _f.cancelLike.tsInServer)];
                    case 5:
                        _j.sent();
                        _j.label = 6;
                    case 6:
                        if (((_g = resp === null || resp === void 0 ? void 0 : resp.data) === null || _g === void 0 ? void 0 : _g.cancelLike.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_h = resp === null || resp === void 0 ? void 0 : resp.data) === null || _h === void 0 ? void 0 : _h.dislike.status);
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        e_7 = _j.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, e_7.message || e_7);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.getReactParams = function (contentId, operation, ts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, message, signature, publicKey, params, e_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = this;
                        return [4 /*yield*/, this.getAddress()];
                    case 1:
                        _a.address = _b.sent();
                        return [4 /*yield*/, this.authWithSigningKey()];
                    case 2:
                        _b.sent();
                        message = {
                            op: operation,
                            address: this.address,
                            target: contentId,
                            ts: ts || Date.now(),
                        };
                        return [4 /*yield*/, (0, crypto_1.signWithSigningKey)(JSON.stringify(message), this.address)];
                    case 3:
                        signature = _b.sent();
                        return [4 /*yield*/, (0, crypto_1.getPublicKey)(this.address)];
                    case 4:
                        publicKey = _b.sent();
                        params = {
                            // address: this.address,
                            postId: contentId,
                            message: JSON.stringify(message),
                            signature: signature,
                            signingKey: publicKey,
                        };
                        return [2 /*return*/, params];
                    case 5:
                        e_8 = _b.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, e_8.message || e_8);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.getCommentParams = function (content, targetContentId, ts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, messageBody, stringifiedMessage, signature, publicKey, params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getAddress()];
                    case 1:
                        _a.address = _b.sent();
                        return [4 /*yield*/, this.authWithSigningKey()];
                    case 2:
                        _b.sent();
                        messageBody = {
                            op: 'comment',
                            title: content.title,
                            body: content.body,
                            address: this.address,
                            ts: ts || Date.now(),
                            chainId: this.chainId,
                            target: targetContentId,
                            handle: this.getHandleWithoutSuffix(content.author),
                        };
                        stringifiedMessage = JSON.stringify(messageBody);
                        return [4 /*yield*/, (0, crypto_1.signWithSigningKey)(stringifiedMessage, this.address)];
                    case 3:
                        signature = _b.sent();
                        return [4 /*yield*/, (0, crypto_1.getPublicKey)(this.address)];
                    case 4:
                        publicKey = _b.sent();
                        params = {
                            contentId: content.id,
                            targetContentId: targetContentId,
                            input: {
                                // authorAddress: this.address,
                                // authorHandle: content.author,
                                message: stringifiedMessage,
                                signature: signature,
                                signingKey: publicKey,
                            },
                        };
                        return [2 /*return*/, params];
                }
            });
        });
    };
    CyberConnect.prototype.retryPublishComment = function (content, targetContentId, ts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getCommentParams(content, targetContentId, ts)];
                    case 1:
                        params = _c.sent();
                        return [4 /*yield*/, (0, queries_1.publishComment)(params, this.endpoint.cyberConnectApi)];
                    case 2:
                        resp = _c.sent();
                        if (((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.publishComment.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, 'Retry comment with ts from server failed: ' +
                                ((_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.publishComment.status));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.publishComment = function (targetContentId, content) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp, e_9;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _j.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.getCommentParams(content, targetContentId)];
                    case 1:
                        params = _j.sent();
                        return [4 /*yield*/, (0, queries_1.publishComment)(params, this.endpoint.cyberConnectApi)];
                    case 2:
                        resp = _j.sent();
                        if (((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.publishComment.status) === 'SUCCESS') {
                            return [2 /*return*/, (_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.publishComment];
                        }
                        if (!(((_c = resp === null || resp === void 0 ? void 0 : resp.data) === null || _c === void 0 ? void 0 : _c.publishComment.status) === 'INVALID_SIGNATURE')) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, crypto_1.clearSigningKey)()];
                    case 3:
                        _j.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_d = resp === null || resp === void 0 ? void 0 : resp.data) === null || _d === void 0 ? void 0 : _d.publishComment.status);
                    case 4:
                        if (!(((_e = resp === null || resp === void 0 ? void 0 : resp.data) === null || _e === void 0 ? void 0 : _e.publishComment.status) === 'MESSAGE_EXPIRED')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.retryPublishComment(content, targetContentId, (_f = resp === null || resp === void 0 ? void 0 : resp.data) === null || _f === void 0 ? void 0 : _f.publishComment.tsInServer)];
                    case 5:
                        _j.sent();
                        _j.label = 6;
                    case 6:
                        if (((_g = resp === null || resp === void 0 ? void 0 : resp.data) === null || _g === void 0 ? void 0 : _g.publishComment.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_h = resp === null || resp === void 0 ? void 0 : resp.data) === null || _h === void 0 ? void 0 : _h.publishComment.status);
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        e_9 = _j.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, e_9.message || e_9);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.createComment = function (targetContentId, content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.publishComment(targetContentId, content)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CyberConnect.prototype.updateComment = function (id, targetContentId, content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.publishComment(targetContentId, __assign(__assign({}, content), { id: id }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CyberConnect.prototype.getPublishPostParams = function (content, ts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, messageBody, stringifiedMessage, signature, publicKey, params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getAddress()];
                    case 1:
                        _a.address = _b.sent();
                        return [4 /*yield*/, this.authWithSigningKey()];
                    case 2:
                        _b.sent();
                        messageBody = {
                            op: 'post',
                            title: content.title,
                            body: content.body,
                            address: this.address,
                            ts: ts || Date.now(),
                            chainId: this.chainId,
                            handle: this.getHandleWithoutSuffix(content.author),
                        };
                        stringifiedMessage = JSON.stringify(messageBody);
                        return [4 /*yield*/, (0, crypto_1.signWithSigningKey)(stringifiedMessage, this.address)];
                    case 3:
                        signature = _b.sent();
                        return [4 /*yield*/, (0, crypto_1.getPublicKey)(this.address)];
                    case 4:
                        publicKey = _b.sent();
                        params = {
                            contentId: content.id,
                            input: {
                                authorAddress: this.address,
                                message: stringifiedMessage,
                                signature: signature,
                                signingKey: publicKey,
                                authorHandle: content.author,
                            },
                        };
                        return [2 /*return*/, params];
                }
            });
        });
    };
    CyberConnect.prototype.retryPublishPost = function (content, ts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getPublishPostParams(content, ts)];
                    case 1:
                        params = _c.sent();
                        return [4 /*yield*/, (0, queries_1.publishPost)(params, this.endpoint.cyberConnectApi)];
                    case 2:
                        resp = _c.sent();
                        if (((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.publishPost.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, 'Retry publish with ts from server failed: ' +
                                ((_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.publishPost.status));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CyberConnect.prototype.publishPost = function (content) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var params, resp, e_10;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _j.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.getPublishPostParams(content)];
                    case 1:
                        params = _j.sent();
                        console.log('params', params);
                        return [2 /*return*/];
                    case 2:
                        resp = _j.sent();
                        if (((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.publishPost.status) === 'SUCCESS') {
                            return [2 /*return*/, (_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.publishPost];
                        }
                        if (!(((_c = resp === null || resp === void 0 ? void 0 : resp.data) === null || _c === void 0 ? void 0 : _c.publishPost.status) === 'INVALID_SIGNATURE')) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, crypto_1.clearSigningKey)()];
                    case 3:
                        _j.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_d = resp === null || resp === void 0 ? void 0 : resp.data) === null || _d === void 0 ? void 0 : _d.publishPost.status);
                    case 4:
                        if (!(((_e = resp === null || resp === void 0 ? void 0 : resp.data) === null || _e === void 0 ? void 0 : _e.publishPost.status) === 'MESSAGE_EXPIRED')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.retryPublishPost(content, (_f = resp === null || resp === void 0 ? void 0 : resp.data) === null || _f === void 0 ? void 0 : _f.publishPost.tsInServer)];
                    case 5:
                        _j.sent();
                        return [2 /*return*/];
                    case 6:
                        if (((_g = resp === null || resp === void 0 ? void 0 : resp.data) === null || _g === void 0 ? void 0 : _g.publishPost.status) !== 'SUCCESS') {
                            throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, (_h = resp === null || resp === void 0 ? void 0 : resp.data) === null || _h === void 0 ? void 0 : _h.publishPost.status);
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        e_10 = _j.sent();
                        throw new error_1.ConnectError(error_1.ErrorCode.GraphqlError, e_10.message || e_10);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return CyberConnect;
}());
exports.default = CyberConnect;
//# sourceMappingURL=cyberConnect.js.map