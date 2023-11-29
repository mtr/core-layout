/*! For license information please see commons-main-transition.js.45f8384cbf9c5e8f68a8.js.LICENSE.txt */
"use strict";(self.webpackChunkcore_layout=self.webpackChunkcore_layout||[]).push([[63],{1109:function(t,e,r){r.d(e,{u:function(){return C}});var n=r(825),o=r(9933),i=r(249),s=r(6127),a=r(3668),u=r(954),c=r(4449),h=r(8342),p=r(6909),f=r(9093),d=r(156),g=r(3253),l=r(9590),m=r(6222),v=r(9808),y=r(9709),_=(0,u.vg)("self"),C=function(){function t(t,e,r){var n=this;if(this._deferred=o.u.$q.defer(),this.promise=this._deferred.promise,this._registeredHooks={},this._hookBuilder=new f.A(this),this.isActive=function(){return n.router.globals.transition===n},this.router=r,this._targetState=e,!e.valid())throw new Error(e.error());this._options=(0,s.l7)({current:(0,u.P0)(this)},e.options()),this.$id=r.transitionService._transitionCount++;var i=d.C.buildToPath(t,e);this._treeChanges=d.C.treeChanges(t,i,this._options.reloadState),this.createTransitionHookRegFns();var a=this._hookBuilder.buildHooksForPhase(c.k.CREATE);h.I.invokeHooks(a,(function(){return null})),this.applyViewConfigs(r)}return t.prototype.onBefore=function(t,e,r){},t.prototype.onStart=function(t,e,r){},t.prototype.onExit=function(t,e,r){},t.prototype.onRetain=function(t,e,r){},t.prototype.onEnter=function(t,e,r){},t.prototype.onFinish=function(t,e,r){},t.prototype.onSuccess=function(t,e,r){},t.prototype.onError=function(t,e,r){},t.prototype.createTransitionHookRegFns=function(){var t=this;this.router.transitionService._pluginapi._getEvents().filter((function(t){return t.hookPhase!==c.k.CREATE})).forEach((function(e){return(0,p.BU)(t,t.router.transitionService,e)}))},t.prototype.getHooks=function(t){return this._registeredHooks[t]},t.prototype.applyViewConfigs=function(t){var e=this._treeChanges.entering.map((function(t){return t.state}));d.C.applyViewConfigs(t.transitionService.$view,this._treeChanges.to,e)},t.prototype.$from=function(){return(0,s.Gb)(this._treeChanges.from).state},t.prototype.$to=function(){return(0,s.Gb)(this._treeChanges.to).state},t.prototype.from=function(){return this.$from().self},t.prototype.to=function(){return this.$to().self},t.prototype.targetState=function(){return this._targetState},t.prototype.is=function(e){return e instanceof t?this.is({to:e.$to().name,from:e.$from().name}):!(e.to&&!(0,p.cN)(this.$to(),e.to,this)||e.from&&!(0,p.cN)(this.$from(),e.from,this))},t.prototype.params=function(t){return void 0===t&&(t="to"),Object.freeze(this._treeChanges[t].map((0,u.vg)("paramValues")).reduce(s.LQ,{}))},t.prototype.paramsChanged=function(){var t=this.params("from"),e=this.params("to"),r=[].concat(this._treeChanges.to).concat(this._treeChanges.from).map((function(t){return t.paramSchema})).reduce(y.FN,[]).reduce(y.v_,[]);return g.d.changed(r,t,e).reduce((function(t,r){return t[r.id]=e[r.id],t}),{})},t.prototype.injector=function(t,e){void 0===e&&(e="to");var r=this._treeChanges[e];return t&&(r=d.C.subPath(r,(function(e){return e.state===t||e.state.name===t}))),new m.l(r).injector()},t.prototype.getResolveTokens=function(t){return void 0===t&&(t="to"),new m.l(this._treeChanges[t]).getTokens()},t.prototype.addResolvable=function(t,e){void 0===e&&(e=""),t=(0,u.is)(l.X)(t)?t:new l.X(t);var r="string"==typeof e?e:e.name,n=this._treeChanges.to,o=(0,s.sE)(n,(function(t){return t.state.name===r}));new m.l(n).addResolvables([t],o.state)},t.prototype.redirectedFrom=function(){return this._options.redirectedFrom||null},t.prototype.originalTransition=function(){var t=this.redirectedFrom();return t&&t.originalTransition()||this},t.prototype.options=function(){return this._options},t.prototype.entering=function(){return(0,s.UI)(this._treeChanges.entering,(0,u.vg)("state")).map(_)},t.prototype.exiting=function(){return(0,s.UI)(this._treeChanges.exiting,(0,u.vg)("state")).map(_).reverse()},t.prototype.retained=function(){return(0,s.UI)(this._treeChanges.retained,(0,u.vg)("state")).map(_)},t.prototype.views=function(t,e){void 0===t&&(t="entering");var r=this._treeChanges[t];return(r=e?r.filter((0,u.OH)("state",e)):r).map((0,u.vg)("views")).filter(s.yR).reduce(s.M7,[])},t.prototype.treeChanges=function(t){return t?this._treeChanges[t]:this._treeChanges},t.prototype.redirect=function(t){for(var e=1,r=this;null!=(r=r.redirectedFrom());)if(++e>20)throw new Error("Too many consecutive Transition redirects (20+)");var n={redirectedFrom:this,source:"redirect"};"url"===this.options().source&&!1!==t.options().location&&(n.location="replace");var o=(0,s.l7)({},this.options(),t.options(),n);t=t.withOptions(o,!0);var i,a=this.router.transitionService.create(this._treeChanges.from,t),c=this._treeChanges.entering,h=a._treeChanges.entering;return d.C.matching(h,c,d.C.nonDynamicParams).filter((0,u.ff)((i=t.options().reloadState,function(t){return i&&t.state.includes[i.name]}))).forEach((function(t,e){t.resolvables=c[e].resolvables})),a},t.prototype._changedParams=function(){var t=this._treeChanges;if(!(this._options.reload||t.exiting.length||t.entering.length||t.to.length!==t.from.length||(0,s.ym)(t.to,t.from).map((function(t){return t[0].state!==t[1].state})).reduce(s.o8,!1))){var e=t.to.map((function(t){return t.paramSchema})),r=[t.to,t.from].map((function(t){return t.map((function(t){return t.paramValues}))})),n=r[0],o=r[1];return(0,s.ym)(e,n,o).map((function(t){var e=t[0],r=t[1],n=t[2];return g.d.changed(e,r,n)})).reduce(s.M7,[])}},t.prototype.dynamic=function(){var t=this._changedParams();return!!t&&t.map((function(t){return t.dynamic})).reduce(s.o8,!1)},t.prototype.ignored=function(){return!!this._ignoredReason()},t.prototype._ignoredReason=function(){var t=this.router.globals.transition,e=this._options.reloadState,r=function(t,r){if(t.length!==r.length)return!1;var n=d.C.matching(t,r);return t.length===n.filter((function(t){return!e||!t.state.includes[e.name]})).length},n=this.treeChanges(),o=t&&t.treeChanges();return o&&r(o.to,n.to)&&r(o.exiting,n.exiting)?"SameAsPending":0===n.exiting.length&&0===n.entering.length&&r(n.from,n.to)?"SameAsCurrent":void 0},t.prototype.run=function(){var t=this,e=h.I.runAllHooks,r=function(e){return t._hookBuilder.buildHooksForPhase(e)},i=r(c.k.BEFORE);return h.I.invokeHooks(i,(function(){var e=t.router.globals;return e.lastStartedTransitionId=t.$id,e.transition=t,e.transitionHistory.enqueue(t),n.g4.traceTransitionStart(t),o.u.$q.when(void 0)})).then((function(){var t=r(c.k.RUN);return h.I.invokeHooks(t,(function(){return o.u.$q.when(void 0)}))})).then((function(){n.g4.traceSuccess(t.$to(),t),t.success=!0,t._deferred.resolve(t.to()),e(r(c.k.SUCCESS))}),(function(o){n.g4.traceError(o,t),t.success=!1,t._deferred.reject(o),t._error=o,e(r(c.k.ERROR))})),this.promise},t.prototype.valid=function(){return!this.error()||void 0!==this.success},t.prototype.abort=function(){(0,a.o8)(this.success)&&(this._aborted=!0)},t.prototype.error=function(){var t=this.$to();if(t.self.abstract)return v.i.invalid("Cannot transition to abstract state '"+t.name+"'");var e=t.parameters(),r=this.params(),n=e.filter((function(t){return!t.validates(r[t.id])}));if(n.length){var o=n.map((function(t){return"["+t.id+":"+(0,i.Pz)(r[t.id])+"]"})).join(", "),s="The following parameter values are not valid for state '"+t.name+"': "+o;return v.i.invalid(s)}return!1===this.success?this._error:void 0},t.prototype.toString=function(){var t=this.from(),e=this.to(),r=function(t){return null!==t["#"]&&void 0!==t["#"]?t:(0,s.CE)(t,["#"])};return"Transition#"+this.$id+"( '"+((0,a.Kn)(t)?t.name:t)+"'"+(0,i.Pz)(r(this._treeChanges.from.map((0,u.vg)("paramValues")).reduce(s.LQ,{})))+" -> "+(this.valid()?"":"(X) ")+"'"+((0,a.Kn)(e)?e.name:e)+"'"+(0,i.Pz)(r(this.params()))+" )"},t.diToken=t,t}()}}]);