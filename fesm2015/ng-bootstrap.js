import { Injectable, Directive, ChangeDetectionStrategy, Component, Input, ViewEncapsulation, TemplateRef, Output, EventEmitter, NgModule, Inject, LOCALE_ID, InjectionToken, ElementRef, forwardRef, Renderer2, ChangeDetectorRef, ContentChildren, NgZone, PLATFORM_ID, ContentChild, Injector, ViewContainerRef, ComponentFactoryResolver, defineInjectable, inject, ApplicationRef, RendererFactory2, INJECTOR } from '@angular/core';
import { CommonModule, isPlatformBrowser, FormStyle, getLocaleDayNames, getLocaleMonthNames, TranslationWidth, formatDate, DOCUMENT } from '@angular/common';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormsModule } from '@angular/forms';
import { Subject, timer, fromEvent, NEVER, race, BehaviorSubject } from 'rxjs';
import { filter, map, switchMap, takeUntil, take, withLatestFrom, tap } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} value
 * @return {?}
 */
function toInteger(value) {
    return parseInt(`${value}`, 10);
}
/**
 * @param {?} value
 * @return {?}
 */
function toString(value) {
    return (value !== undefined && value !== null) ? `${value}` : '';
}
/**
 * @param {?} value
 * @param {?} max
 * @param {?=} min
 * @return {?}
 */
function getValueInRange(value, max, min = 0) {
    return Math.max(Math.min(value, max), min);
}
/**
 * @param {?} value
 * @return {?}
 */
function isString(value) {
    return typeof value === 'string';
}
/**
 * @param {?} value
 * @return {?}
 */
function isNumber(value) {
    return !isNaN(toInteger(value));
}
/**
 * @param {?} value
 * @return {?}
 */
function isInteger(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}
/**
 * @param {?} value
 * @return {?}
 */
function isDefined(value) {
    return value !== undefined && value !== null;
}
/**
 * @param {?} value
 * @return {?}
 */
function padNumber(value) {
    if (isNumber(value)) {
        return `0${value}`.slice(-2);
    }
    else {
        return '';
    }
}
/**
 * @param {?} text
 * @return {?}
 */
function regExpEscape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbAccordion component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the accordions used in the application.
 */
class NgbAccordionConfig {
    constructor() {
        this.closeOthers = false;
    }
}
NgbAccordionConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbAccordionConfig.ngInjectableDef = defineInjectable({ factory: function NgbAccordionConfig_Factory() { return new NgbAccordionConfig(); }, token: NgbAccordionConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
let nextId = 0;
/**
 * This directive should be used to wrap accordion panel titles that need to contain HTML markup or other directives.
 */
class NgbPanelTitle {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPanelTitle.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbPanelTitle]' },] }
];
/** @nocollapse */
NgbPanelTitle.ctorParameters = () => [
    { type: TemplateRef }
];
/**
 * This directive must be used to wrap accordion panel content.
 */
class NgbPanelContent {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPanelContent.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbPanelContent]' },] }
];
/** @nocollapse */
NgbPanelContent.ctorParameters = () => [
    { type: TemplateRef }
];
/**
 * The NgbPanel directive represents an individual panel with the title and collapsible
 * content
 */
class NgbPanel {
    constructor() {
        /**
         *  A flag determining whether the panel is disabled or not.
         *  When disabled, the panel cannot be toggled.
         */
        this.disabled = false;
        /**
         *  An optional id for the panel. The id should be unique.
         *  If not provided, it will be auto-generated.
         */
        this.id = `ngb-panel-${nextId++}`;
        /**
         * A flag telling if the panel is currently open
         */
        this.isOpen = false;
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        // We are using @ContentChildren instead of @ContentChild as in the Angular version being used
        // only @ContentChildren allows us to specify the {descendants: false} option.
        // Without {descendants: false} we are hitting bugs described in:
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
        this.titleTpl = this.titleTpls.first;
        this.contentTpl = this.contentTpls.first;
    }
}
NgbPanel.decorators = [
    { type: Directive, args: [{ selector: 'ngb-panel' },] }
];
NgbPanel.propDecorators = {
    disabled: [{ type: Input }],
    id: [{ type: Input }],
    title: [{ type: Input }],
    type: [{ type: Input }],
    titleTpls: [{ type: ContentChildren, args: [NgbPanelTitle, { descendants: false },] }],
    contentTpls: [{ type: ContentChildren, args: [NgbPanelContent, { descendants: false },] }]
};
/**
 * The NgbAccordion directive is a collection of panels.
 * It can assure that only one panel can be opened at a time.
 */
class NgbAccordion {
    /**
     * @param {?} config
     */
    constructor(config) {
        /**
         * An array or comma separated strings of panel identifiers that should be opened
         */
        this.activeIds = [];
        /**
         * Whether the closed panels should be hidden without destroying them
         */
        this.destroyOnHide = true;
        /**
         * A panel change event fired right before the panel toggle happens. See NgbPanelChangeEvent for payload details
         */
        this.panelChange = new EventEmitter();
        this.type = config.type;
        this.closeOtherPanels = config.closeOthers;
    }
    /**
     * Checks if a panel with a given id is expanded or not.
     * @param {?} panelId
     * @return {?}
     */
    isExpanded(panelId) { return this.activeIds.indexOf(panelId) > -1; }
    /**
     * Expands a panel with a given id. Has no effect if the panel is already expanded or disabled.
     * @param {?} panelId
     * @return {?}
     */
    expand(panelId) { this._changeOpenState(this._findPanelById(panelId), true); }
    /**
     * Expands all panels if [closeOthers]="false". For the [closeOthers]="true" case will have no effect if there is an
     * open panel, otherwise the first panel will be expanded.
     * @return {?}
     */
    expandAll() {
        if (this.closeOtherPanels) {
            if (this.activeIds.length === 0 && this.panels.length) {
                this._changeOpenState(this.panels.first, true);
            }
        }
        else {
            this.panels.forEach(panel => this._changeOpenState(panel, true));
        }
    }
    /**
     * Collapses a panel with a given id. Has no effect if the panel is already collapsed or disabled.
     * @param {?} panelId
     * @return {?}
     */
    collapse(panelId) { this._changeOpenState(this._findPanelById(panelId), false); }
    /**
     * Collapses all open panels.
     * @return {?}
     */
    collapseAll() {
        this.panels.forEach((panel) => { this._changeOpenState(panel, false); });
    }
    /**
     * Programmatically toggle a panel with a given id. Has no effect if the panel is disabled.
     * @param {?} panelId
     * @return {?}
     */
    toggle(panelId) {
        /** @type {?} */
        const panel = this._findPanelById(panelId);
        if (panel) {
            this._changeOpenState(panel, !panel.isOpen);
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        // active id updates
        if (isString(this.activeIds)) {
            this.activeIds = this.activeIds.split(/\s*,\s*/);
        }
        // update panels open states
        this.panels.forEach(panel => panel.isOpen = !panel.disabled && this.activeIds.indexOf(panel.id) > -1);
        // closeOthers updates
        if (this.activeIds.length > 1 && this.closeOtherPanels) {
            this._closeOthers(this.activeIds[0]);
            this._updateActiveIds();
        }
    }
    /**
     * @param {?} panel
     * @param {?} nextState
     * @return {?}
     */
    _changeOpenState(panel, nextState) {
        if (panel && !panel.disabled && panel.isOpen !== nextState) {
            /** @type {?} */
            let defaultPrevented = false;
            this.panelChange.emit({ panelId: panel.id, nextState: nextState, preventDefault: () => { defaultPrevented = true; } });
            if (!defaultPrevented) {
                panel.isOpen = nextState;
                if (nextState && this.closeOtherPanels) {
                    this._closeOthers(panel.id);
                }
                this._updateActiveIds();
            }
        }
    }
    /**
     * @param {?} panelId
     * @return {?}
     */
    _closeOthers(panelId) {
        this.panels.forEach(panel => {
            if (panel.id !== panelId) {
                panel.isOpen = false;
            }
        });
    }
    /**
     * @param {?} panelId
     * @return {?}
     */
    _findPanelById(panelId) { return this.panels.find(p => p.id === panelId); }
    /**
     * @return {?}
     */
    _updateActiveIds() {
        this.activeIds = this.panels.filter(panel => panel.isOpen && !panel.disabled).map(panel => panel.id);
    }
}
NgbAccordion.decorators = [
    { type: Component, args: [{
                selector: 'ngb-accordion',
                exportAs: 'ngbAccordion',
                host: { 'class': 'accordion', 'role': 'tablist', '[attr.aria-multiselectable]': '!closeOtherPanels' },
                template: `
    <ng-template ngFor let-panel [ngForOf]="panels">
      <div class="card">
        <div role="tab" id="{{panel.id}}-header" [class]="'card-header ' + (panel.type ? 'bg-'+panel.type: type ? 'bg-'+type : '')">
          <h5 class="mb-0">
            <button type="button" class="btn btn-link"
              (click)="toggle(panel.id)" [disabled]="panel.disabled" [class.collapsed]="!panel.isOpen"
              [attr.aria-expanded]="panel.isOpen" [attr.aria-controls]="panel.id">
              {{panel.title}}<ng-template [ngTemplateOutlet]="panel.titleTpl?.templateRef"></ng-template>
            </button>
          </h5>
        </div>
        <div id="{{panel.id}}" role="tabpanel" [attr.aria-labelledby]="panel.id + '-header'"
             class="collapse" [class.show]="panel.isOpen" *ngIf="!destroyOnHide || panel.isOpen">
          <div class="card-body">
               <ng-template [ngTemplateOutlet]="panel.contentTpl?.templateRef"></ng-template>
          </div>
        </div>
      </div>
    </ng-template>
  `
            }] }
];
/** @nocollapse */
NgbAccordion.ctorParameters = () => [
    { type: NgbAccordionConfig }
];
NgbAccordion.propDecorators = {
    panels: [{ type: ContentChildren, args: [NgbPanel,] }],
    activeIds: [{ type: Input }],
    closeOtherPanels: [{ type: Input, args: ['closeOthers',] }],
    destroyOnHide: [{ type: Input }],
    type: [{ type: Input }],
    panelChange: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_ACCORDION_DIRECTIVES = [NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent];
class NgbAccordionModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbAccordionModule }; }
}
NgbAccordionModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_ACCORDION_DIRECTIVES, exports: NGB_ACCORDION_DIRECTIVES, imports: [CommonModule] },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbAlert component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the alerts used in the application.
 */
class NgbAlertConfig {
    constructor() {
        this.dismissible = true;
        this.type = 'warning';
    }
}
NgbAlertConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbAlertConfig.ngInjectableDef = defineInjectable({ factory: function NgbAlertConfig_Factory() { return new NgbAlertConfig(); }, token: NgbAlertConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Alerts can be used to provide feedback messages.
 */
class NgbAlert {
    /**
     * @param {?} config
     * @param {?} _renderer
     * @param {?} _element
     */
    constructor(config, _renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
        /**
         * An event emitted when the close button is clicked. This event has no payload. Only relevant for dismissible alerts.
         */
        this.close = new EventEmitter();
        this.dismissible = config.dismissible;
        this.type = config.type;
    }
    /**
     * @return {?}
     */
    closeHandler() { this.close.emit(null); }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const typeChange = changes['type'];
        if (typeChange && !typeChange.firstChange) {
            this._renderer.removeClass(this._element.nativeElement, `alert-${typeChange.previousValue}`);
            this._renderer.addClass(this._element.nativeElement, `alert-${typeChange.currentValue}`);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() { this._renderer.addClass(this._element.nativeElement, `alert-${this.type}`); }
}
NgbAlert.decorators = [
    { type: Component, args: [{
                selector: 'ngb-alert',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                host: { 'role': 'alert', 'class': 'alert', '[class.alert-dismissible]': 'dismissible' },
                template: `
    <button *ngIf="dismissible" type="button" class="close" aria-label="Close" i18n-aria-label="@@ngb.alert.close"
      (click)="closeHandler()">
      <span aria-hidden="true">&times;</span>
    </button>
    <ng-content></ng-content>
    `,
                styles: ["ngb-alert{display:block}"]
            }] }
];
/** @nocollapse */
NgbAlert.ctorParameters = () => [
    { type: NgbAlertConfig },
    { type: Renderer2 },
    { type: ElementRef }
];
NgbAlert.propDecorators = {
    dismissible: [{ type: Input }],
    type: [{ type: Input }],
    close: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbAlertModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbAlertModule }; }
}
NgbAlertModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbAlert], exports: [NgbAlert], imports: [CommonModule], entryComponents: [NgbAlert] },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbButtonLabel {
}
NgbButtonLabel.decorators = [
    { type: Directive, args: [{
                selector: '[ngbButtonLabel]',
                host: { '[class.btn]': 'true', '[class.active]': 'active', '[class.disabled]': 'disabled', '[class.focus]': 'focused' }
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbCheckBox),
    multi: true
};
/**
 * Easily create Bootstrap-style checkbox buttons. A value of a checked button is bound to a variable
 * specified via ngModel.
 */
class NgbCheckBox {
    /**
     * @param {?} _label
     */
    constructor(_label) {
        this._label = _label;
        /**
         * A flag indicating if a given checkbox button is disabled.
         */
        this.disabled = false;
        /**
         * Value to be propagated as model when the checkbox is checked.
         */
        this.valueChecked = true;
        /**
         * Value to be propagated as model when the checkbox is unchecked.
         */
        this.valueUnChecked = false;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    /**
     * @param {?} isFocused
     * @return {?}
     */
    set focused(isFocused) {
        this._label.focused = isFocused;
        if (!isFocused) {
            this.onTouched();
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onInputChange($event) {
        /** @type {?} */
        const modelToPropagate = $event.target.checked ? this.valueChecked : this.valueUnChecked;
        this.onChange(modelToPropagate);
        this.onTouched();
        this.writeValue(modelToPropagate);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._label.disabled = isDisabled;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.checked = value === this.valueChecked;
        this._label.active = this.checked;
    }
}
NgbCheckBox.decorators = [
    { type: Directive, args: [{
                selector: '[ngbButton][type=checkbox]',
                host: {
                    'autocomplete': 'off',
                    '[checked]': 'checked',
                    '[disabled]': 'disabled',
                    '(change)': 'onInputChange($event)',
                    '(focus)': 'focused = true',
                    '(blur)': 'focused = false'
                },
                providers: [NGB_CHECKBOX_VALUE_ACCESSOR]
            },] }
];
/** @nocollapse */
NgbCheckBox.ctorParameters = () => [
    { type: NgbButtonLabel }
];
NgbCheckBox.propDecorators = {
    disabled: [{ type: Input }],
    valueChecked: [{ type: Input }],
    valueUnChecked: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_RADIO_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbRadioGroup),
    multi: true
};
/** @type {?} */
let nextId$1 = 0;
/**
 * Easily create Bootstrap-style radio buttons. A value of a selected button is bound to a variable
 * specified via ngModel.
 */
class NgbRadioGroup {
    constructor() {
        this._radios = new Set();
        this._value = null;
        /**
         * The name of the group. Unless enclosed inputs specify a name, this name is used as the name of the
         * enclosed inputs. If not specified, a name is generated automatically.
         */
        this.name = `ngb-radio-${nextId$1++}`;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    /**
     * @return {?}
     */
    get disabled() { return this._disabled; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    set disabled(isDisabled) { this.setDisabledState(isDisabled); }
    /**
     * @param {?} radio
     * @return {?}
     */
    onRadioChange(radio) {
        this.writeValue(radio.value);
        this.onChange(radio.value);
    }
    /**
     * @return {?}
     */
    onRadioValueUpdate() { this._updateRadiosValue(); }
    /**
     * @param {?} radio
     * @return {?}
     */
    register(radio) { this._radios.add(radio); }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._disabled = isDisabled;
        this._updateRadiosDisabled();
    }
    /**
     * @param {?} radio
     * @return {?}
     */
    unregister(radio) { this._radios.delete(radio); }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this._value = value;
        this._updateRadiosValue();
    }
    /**
     * @return {?}
     */
    _updateRadiosValue() { this._radios.forEach((radio) => radio.updateValue(this._value)); }
    /**
     * @return {?}
     */
    _updateRadiosDisabled() { this._radios.forEach((radio) => radio.updateDisabled()); }
}
NgbRadioGroup.decorators = [
    { type: Directive, args: [{ selector: '[ngbRadioGroup]', host: { 'role': 'group' }, providers: [NGB_RADIO_VALUE_ACCESSOR] },] }
];
NgbRadioGroup.propDecorators = {
    name: [{ type: Input }]
};
/**
 * Marks an input of type "radio" as part of the NgbRadioGroup.
 */
class NgbRadio {
    /**
     * @param {?} _group
     * @param {?} _label
     * @param {?} _renderer
     * @param {?} _element
     */
    constructor(_group, _label, _renderer, _element) {
        this._group = _group;
        this._label = _label;
        this._renderer = _renderer;
        this._element = _element;
        this._value = null;
        this._group.register(this);
        this.updateDisabled();
    }
    /**
     * You can specify model value of a given radio by binding to the value property.
     * @param {?} value
     * @return {?}
     */
    set value(value) {
        this._value = value;
        /** @type {?} */
        const stringValue = value ? value.toString() : '';
        this._renderer.setProperty(this._element.nativeElement, 'value', stringValue);
        this._group.onRadioValueUpdate();
    }
    /**
     * A flag indicating if a given radio button is disabled.
     * @param {?} isDisabled
     * @return {?}
     */
    set disabled(isDisabled) {
        this._disabled = isDisabled !== false;
        this.updateDisabled();
    }
    /**
     * @param {?} isFocused
     * @return {?}
     */
    set focused(isFocused) {
        if (this._label) {
            this._label.focused = isFocused;
        }
        if (!isFocused) {
            this._group.onTouched();
        }
    }
    /**
     * @return {?}
     */
    get checked() { return this._checked; }
    /**
     * @return {?}
     */
    get disabled() { return this._group.disabled || this._disabled; }
    /**
     * @return {?}
     */
    get value() { return this._value; }
    /**
     * @return {?}
     */
    get nameAttr() { return this.name || this._group.name; }
    /**
     * @return {?}
     */
    ngOnDestroy() { this._group.unregister(this); }
    /**
     * @return {?}
     */
    onChange() { this._group.onRadioChange(this); }
    /**
     * @param {?} value
     * @return {?}
     */
    updateValue(value) {
        this._checked = this.value === value;
        this._label.active = this._checked;
    }
    /**
     * @return {?}
     */
    updateDisabled() { this._label.disabled = this.disabled; }
}
NgbRadio.decorators = [
    { type: Directive, args: [{
                selector: '[ngbButton][type=radio]',
                host: {
                    '[checked]': 'checked',
                    '[disabled]': 'disabled',
                    '[name]': 'nameAttr',
                    '(change)': 'onChange()',
                    '(focus)': 'focused = true',
                    '(blur)': 'focused = false'
                }
            },] }
];
/** @nocollapse */
NgbRadio.ctorParameters = () => [
    { type: NgbRadioGroup },
    { type: NgbButtonLabel },
    { type: Renderer2 },
    { type: ElementRef }
];
NgbRadio.propDecorators = {
    name: [{ type: Input }],
    value: [{ type: Input, args: ['value',] }],
    disabled: [{ type: Input, args: ['disabled',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_BUTTON_DIRECTIVES = [NgbButtonLabel, NgbCheckBox, NgbRadioGroup, NgbRadio];
class NgbButtonsModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbButtonsModule }; }
}
NgbButtonsModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_BUTTON_DIRECTIVES, exports: NGB_BUTTON_DIRECTIVES },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbCarousel component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the carousels used in the application.
 */
class NgbCarouselConfig {
    constructor() {
        this.interval = 5000;
        this.wrap = true;
        this.keyboard = true;
        this.pauseOnHover = true;
        this.showNavigationArrows = true;
        this.showNavigationIndicators = true;
    }
}
NgbCarouselConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbCarouselConfig.ngInjectableDef = defineInjectable({ factory: function NgbCarouselConfig_Factory() { return new NgbCarouselConfig(); }, token: NgbCarouselConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
let nextId$2 = 0;
/**
 * Represents an individual slide to be used within a carousel.
 */
class NgbSlide {
    /**
     * @param {?} tplRef
     */
    constructor(tplRef) {
        this.tplRef = tplRef;
        /**
         * Unique slide identifier. Must be unique for the entire document for proper accessibility support.
         * Will be auto-generated if not provided.
         */
        this.id = `ngb-slide-${nextId$2++}`;
    }
}
NgbSlide.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbSlide]' },] }
];
/** @nocollapse */
NgbSlide.ctorParameters = () => [
    { type: TemplateRef }
];
NgbSlide.propDecorators = {
    id: [{ type: Input }]
};
/**
 * Directive to easily create carousels based on Bootstrap's markup.
 */
class NgbCarousel {
    /**
     * @param {?} config
     * @param {?} _platformId
     * @param {?} _ngZone
     * @param {?} _cd
     */
    constructor(config, _platformId, _ngZone, _cd) {
        this._platformId = _platformId;
        this._ngZone = _ngZone;
        this._cd = _cd;
        this._start$ = new Subject();
        this._stop$ = new Subject();
        /**
         * A carousel slide event fired when the slide transition is completed.
         * See NgbSlideEvent for payload details
         */
        this.slide = new EventEmitter();
        this.interval = config.interval;
        this.wrap = config.wrap;
        this.keyboard = config.keyboard;
        this.pauseOnHover = config.pauseOnHover;
        this.showNavigationArrows = config.showNavigationArrows;
        this.showNavigationIndicators = config.showNavigationIndicators;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        // setInterval() doesn't play well with SSR and protractor,
        // so we should run it in the browser and outside Angular
        if (isPlatformBrowser(this._platformId)) {
            this._ngZone.runOutsideAngular(() => {
                this._start$
                    .pipe(map(() => this.interval), filter(interval => interval > 0 && this.slides.length > 0), switchMap(interval => timer(interval).pipe(takeUntil(this._stop$))))
                    .subscribe(() => this._ngZone.run(() => this.next()));
                this._start$.next();
            });
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        /** @type {?} */
        let activeSlide = this._getSlideById(this.activeId);
        this.activeId = activeSlide ? activeSlide.id : (this.slides.length ? this.slides.first.id : null);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() { this._stop$.next(); }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if ('interval' in changes && !changes['interval'].isFirstChange()) {
            this._start$.next();
        }
    }
    /**
     * Navigate to a slide with the specified identifier.
     * @param {?} slideId
     * @return {?}
     */
    select(slideId) { this._cycleToSelected(slideId, this._getSlideEventDirection(this.activeId, slideId)); }
    /**
     * Navigate to the next slide.
     * @return {?}
     */
    prev() { this._cycleToSelected(this._getPrevSlide(this.activeId), NgbSlideEventDirection.RIGHT); }
    /**
     * Navigate to the next slide.
     * @return {?}
     */
    next() { this._cycleToSelected(this._getNextSlide(this.activeId), NgbSlideEventDirection.LEFT); }
    /**
     * Stops the carousel from cycling through items.
     * @return {?}
     */
    pause() { this._stop$.next(); }
    /**
     * Restarts cycling through the carousel slides from left to right.
     * @return {?}
     */
    cycle() { this._start$.next(); }
    /**
     * @param {?} slideIdx
     * @param {?} direction
     * @return {?}
     */
    _cycleToSelected(slideIdx, direction) {
        /** @type {?} */
        let selectedSlide = this._getSlideById(slideIdx);
        if (selectedSlide && selectedSlide.id !== this.activeId) {
            this.slide.emit({ prev: this.activeId, current: selectedSlide.id, direction: direction });
            this._start$.next();
            this.activeId = selectedSlide.id;
        }
        // we get here after the interval fires or any external API call like next(), prev() or select()
        this._cd.markForCheck();
    }
    /**
     * @param {?} currentActiveSlideId
     * @param {?} nextActiveSlideId
     * @return {?}
     */
    _getSlideEventDirection(currentActiveSlideId, nextActiveSlideId) {
        /** @type {?} */
        const currentActiveSlideIdx = this._getSlideIdxById(currentActiveSlideId);
        /** @type {?} */
        const nextActiveSlideIdx = this._getSlideIdxById(nextActiveSlideId);
        return currentActiveSlideIdx > nextActiveSlideIdx ? NgbSlideEventDirection.RIGHT : NgbSlideEventDirection.LEFT;
    }
    /**
     * @param {?} slideId
     * @return {?}
     */
    _getSlideById(slideId) { return this.slides.find(slide => slide.id === slideId); }
    /**
     * @param {?} slideId
     * @return {?}
     */
    _getSlideIdxById(slideId) {
        return this.slides.toArray().indexOf(this._getSlideById(slideId));
    }
    /**
     * @param {?} currentSlideId
     * @return {?}
     */
    _getNextSlide(currentSlideId) {
        /** @type {?} */
        const slideArr = this.slides.toArray();
        /** @type {?} */
        const currentSlideIdx = this._getSlideIdxById(currentSlideId);
        /** @type {?} */
        const isLastSlide = currentSlideIdx === slideArr.length - 1;
        return isLastSlide ? (this.wrap ? slideArr[0].id : slideArr[slideArr.length - 1].id) :
            slideArr[currentSlideIdx + 1].id;
    }
    /**
     * @param {?} currentSlideId
     * @return {?}
     */
    _getPrevSlide(currentSlideId) {
        /** @type {?} */
        const slideArr = this.slides.toArray();
        /** @type {?} */
        const currentSlideIdx = this._getSlideIdxById(currentSlideId);
        /** @type {?} */
        const isFirstSlide = currentSlideIdx === 0;
        return isFirstSlide ? (this.wrap ? slideArr[slideArr.length - 1].id : slideArr[0].id) :
            slideArr[currentSlideIdx - 1].id;
    }
}
NgbCarousel.decorators = [
    { type: Component, args: [{
                selector: 'ngb-carousel',
                exportAs: 'ngbCarousel',
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'carousel slide',
                    '[style.display]': '"block"',
                    'tabIndex': '0',
                    '(mouseenter)': 'pauseOnHover && pause()',
                    '(mouseleave)': 'pauseOnHover && cycle()',
                    '(keydown.arrowLeft)': 'keyboard && prev()',
                    '(keydown.arrowRight)': 'keyboard && next()'
                },
                template: `
    <ol class="carousel-indicators" *ngIf="showNavigationIndicators">
      <li *ngFor="let slide of slides" [id]="slide.id" [class.active]="slide.id === activeId"
          (click)="select(slide.id); pauseOnHover && pause()"></li>
    </ol>
    <div class="carousel-inner">
      <div *ngFor="let slide of slides" class="carousel-item" [class.active]="slide.id === activeId">
        <ng-template [ngTemplateOutlet]="slide.tplRef"></ng-template>
      </div>
    </div>
    <a class="carousel-control-prev" role="button" (click)="prev()" *ngIf="showNavigationArrows">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only" i18n="@@ngb.carousel.previous">Previous</span>
    </a>
    <a class="carousel-control-next" role="button" (click)="next()" *ngIf="showNavigationArrows">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only" i18n="@@ngb.carousel.next">Next</span>
    </a>
  `
            }] }
];
/** @nocollapse */
NgbCarousel.ctorParameters = () => [
    { type: NgbCarouselConfig },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: NgZone },
    { type: ChangeDetectorRef }
];
NgbCarousel.propDecorators = {
    slides: [{ type: ContentChildren, args: [NgbSlide,] }],
    activeId: [{ type: Input }],
    interval: [{ type: Input }],
    wrap: [{ type: Input }],
    keyboard: [{ type: Input }],
    pauseOnHover: [{ type: Input }],
    showNavigationArrows: [{ type: Input }],
    showNavigationIndicators: [{ type: Input }],
    slide: [{ type: Output }]
};
/** @enum {string} */
const NgbSlideEventDirection = {
    LEFT: (/** @type {?} */ ('left')),
    RIGHT: (/** @type {?} */ ('right')),
};
/** @type {?} */
const NGB_CAROUSEL_DIRECTIVES = [NgbCarousel, NgbSlide];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbCarouselModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbCarouselModule }; }
}
NgbCarouselModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_CAROUSEL_DIRECTIVES, exports: NGB_CAROUSEL_DIRECTIVES, imports: [CommonModule] },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * The NgbCollapse directive provides a simple way to hide and show an element with animations.
 */
class NgbCollapse {
    constructor() {
        /**
         * A flag indicating collapsed (true) or open (false) state.
         */
        this.collapsed = false;
    }
}
NgbCollapse.decorators = [
    { type: Directive, args: [{
                selector: '[ngbCollapse]',
                exportAs: 'ngbCollapse',
                host: { '[class.collapse]': 'true', '[class.show]': '!collapsed' }
            },] }
];
NgbCollapse.propDecorators = {
    collapsed: [{ type: Input, args: ['ngbCollapse',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbCollapseModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbCollapseModule }; }
}
NgbCollapseModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbCollapse], exports: [NgbCollapse] },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Simple class used for a date representation that datepicker also uses internally
 *
 * \@since 3.0.0
 */
class NgbDate {
    /**
     * Static method. Creates a new date object from the NgbDateStruct, ex. NgbDate.from({year: 2000,
     * month: 5, day: 1}). If the 'date' is already of NgbDate, the method will return the same object
     * @param {?} date
     * @return {?}
     */
    static from(date) {
        if (date instanceof NgbDate) {
            return date;
        }
        return date ? new NgbDate(date.year, date.month, date.day) : null;
    }
    /**
     * @param {?} year
     * @param {?} month
     * @param {?} day
     */
    constructor(year, month, day) {
        this.year = isInteger(year) ? year : null;
        this.month = isInteger(month) ? month : null;
        this.day = isInteger(day) ? day : null;
    }
    /**
     * Checks if current date is equal to another date
     * @param {?} other
     * @return {?}
     */
    equals(other) {
        return other && this.year === other.year && this.month === other.month && this.day === other.day;
    }
    /**
     * Checks if current date is before another date
     * @param {?} other
     * @return {?}
     */
    before(other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day < other.day;
            }
            else {
                return this.month < other.month;
            }
        }
        else {
            return this.year < other.year;
        }
    }
    /**
     * Checks if current date is after another date
     * @param {?} other
     * @return {?}
     */
    after(other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day > other.day;
            }
            else {
                return this.month > other.month;
            }
        }
        else {
            return this.year > other.year;
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} jsDate
 * @return {?}
 */
function fromJSDate(jsDate) {
    return new NgbDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
}
/**
 * @param {?} date
 * @return {?}
 */
function toJSDate(date) {
    /** @type {?} */
    const jsDate = new Date(date.year, date.month - 1, date.day, 12);
    // this is done avoid 30 -> 1930 conversion
    if (!isNaN(jsDate.getTime())) {
        jsDate.setFullYear(date.year);
    }
    return jsDate;
}
/**
 * @return {?}
 */
function NGB_DATEPICKER_CALENDAR_FACTORY() {
    return new NgbCalendarGregorian();
}
/**
 * Calendar used by the datepicker.
 * Default implementation uses Gregorian calendar.
 * @abstract
 */
class NgbCalendar {
}
NgbCalendar.decorators = [
    { type: Injectable, args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_CALENDAR_FACTORY },] }
];
/** @nocollapse */ NgbCalendar.ngInjectableDef = defineInjectable({ factory: NGB_DATEPICKER_CALENDAR_FACTORY, token: NgbCalendar, providedIn: "root" });
class NgbCalendarGregorian extends NgbCalendar {
    /**
     * @return {?}
     */
    getDaysPerWeek() { return 7; }
    /**
     * @return {?}
     */
    getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }
    /**
     * @return {?}
     */
    getWeeksPerMonth() { return 6; }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getNext(date, period = 'd', number = 1) {
        /** @type {?} */
        let jsDate = toJSDate(date);
        switch (period) {
            case 'y':
                return new NgbDate(date.year + number, 1, 1);
            case 'm':
                jsDate = new Date(date.year, date.month + number - 1, 1, 12);
                break;
            case 'd':
                jsDate.setDate(jsDate.getDate() + number);
                break;
            default:
                return date;
        }
        return fromJSDate(jsDate);
    }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    /**
     * @param {?} date
     * @return {?}
     */
    getWeekday(date) {
        /** @type {?} */
        let jsDate = toJSDate(date);
        /** @type {?} */
        let day = jsDate.getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    /**
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    getWeekNumber(week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        /** @type {?} */
        const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        /** @type {?} */
        let date = week[thursdayIndex];
        /** @type {?} */
        const jsDate = toJSDate(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7)); // Thursday
        // Thursday
        /** @type {?} */
        const time = jsDate.getTime();
        jsDate.setMonth(0); // Compare with Jan 1
        jsDate.setDate(1);
        return Math.floor(Math.round((time - jsDate.getTime()) / 86400000) / 7) + 1;
    }
    /**
     * @return {?}
     */
    getToday() { return fromJSDate(new Date()); }
    /**
     * @param {?} date
     * @return {?}
     */
    isValid(date) {
        if (!date || !isInteger(date.year) || !isInteger(date.month) || !isInteger(date.day)) {
            return false;
        }
        // year 0 doesn't exist in Gregorian calendar
        if (date.year === 0) {
            return false;
        }
        /** @type {?} */
        const jsDate = toJSDate(date);
        return !isNaN(jsDate.getTime()) && jsDate.getFullYear() === date.year && jsDate.getMonth() + 1 === date.month &&
            jsDate.getDate() === date.day;
    }
}
NgbCalendarGregorian.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} prev
 * @param {?} next
 * @return {?}
 */
function isChangedDate(prev, next) {
    return !dateComparator(prev, next);
}
/**
 * @param {?} prev
 * @param {?} next
 * @return {?}
 */
function dateComparator(prev, next) {
    return (!prev && !next) || (!!prev && !!next && prev.equals(next));
}
/**
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
function checkMinBeforeMax(minDate, maxDate) {
    if (maxDate && minDate && maxDate.before(minDate)) {
        throw new Error(`'maxDate' ${maxDate} should be greater than 'minDate' ${minDate}`);
    }
}
/**
 * @param {?} date
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
function checkDateInRange(date, minDate, maxDate) {
    if (date && minDate && date.before(minDate)) {
        return minDate;
    }
    if (date && maxDate && date.after(maxDate)) {
        return maxDate;
    }
    return date;
}
/**
 * @param {?} date
 * @param {?} state
 * @return {?}
 */
function isDateSelectable(date, state) {
    const { minDate, maxDate, disabled, markDisabled } = state;
    // clang-format off
    return !(!isDefined(date) ||
        disabled ||
        (markDisabled && markDisabled(date, { year: date.year, month: date.month })) ||
        (minDate && date.before(minDate)) ||
        (maxDate && date.after(maxDate)));
    // clang-format on
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
function generateSelectBoxMonths(calendar, date, minDate, maxDate) {
    if (!date) {
        return [];
    }
    /** @type {?} */
    let months = calendar.getMonths(date.year);
    if (minDate && date.year === minDate.year) {
        /** @type {?} */
        const index = months.findIndex(month => month === minDate.month);
        months = months.slice(index);
    }
    if (maxDate && date.year === maxDate.year) {
        /** @type {?} */
        const index = months.findIndex(month => month === maxDate.month);
        months = months.slice(0, index + 1);
    }
    return months;
}
/**
 * @param {?} date
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
function generateSelectBoxYears(date, minDate, maxDate) {
    if (!date) {
        return [];
    }
    /** @type {?} */
    const start = minDate && minDate.year || date.year - 10;
    /** @type {?} */
    const end = maxDate && maxDate.year || date.year + 10;
    return Array.from({ length: end - start + 1 }, (e, i) => start + i);
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} maxDate
 * @return {?}
 */
function nextMonthDisabled(calendar, date, maxDate) {
    return maxDate && calendar.getNext(date, 'm').after(maxDate);
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} minDate
 * @return {?}
 */
function prevMonthDisabled(calendar, date, minDate) {
    /** @type {?} */
    const prevDate = calendar.getPrev(date, 'm');
    return minDate && (prevDate.year === minDate.year && prevDate.month < minDate.month ||
        prevDate.year < minDate.year && minDate.month === 1);
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} state
 * @param {?} i18n
 * @param {?} force
 * @return {?}
 */
function buildMonths(calendar, date, state, i18n, force) {
    const { displayMonths, months } = state;
    // move old months to a temporary array
    /** @type {?} */
    const monthsToReuse = months.splice(0, months.length);
    // generate new first dates, nullify or reuse months
    /** @type {?} */
    const firstDates = Array.from({ length: displayMonths }, (_, i) => {
        /** @type {?} */
        const firstDate = calendar.getNext(date, 'm', i);
        months[i] = null;
        if (!force) {
            /** @type {?} */
            const reusedIndex = monthsToReuse.findIndex(month => month.firstDate.equals(firstDate));
            // move reused month back to months
            if (reusedIndex !== -1) {
                months[i] = monthsToReuse.splice(reusedIndex, 1)[0];
            }
        }
        return firstDate;
    });
    // rebuild nullified months
    firstDates.forEach((firstDate, i) => {
        if (months[i] === null) {
            months[i] = buildMonth(calendar, firstDate, state, i18n, monthsToReuse.shift() || (/** @type {?} */ ({})));
        }
    });
    return months;
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} state
 * @param {?} i18n
 * @param {?=} month
 * @return {?}
 */
function buildMonth(calendar, date, state, i18n, month = (/** @type {?} */ ({}))) {
    const { dayTemplateData, minDate, maxDate, firstDayOfWeek, markDisabled, outsideDays } = state;
    month.firstDate = null;
    month.lastDate = null;
    month.number = date.month;
    month.year = date.year;
    month.weeks = month.weeks || [];
    month.weekdays = month.weekdays || [];
    date = getFirstViewDate(calendar, date, firstDayOfWeek);
    // month has weeks
    for (let week = 0; week < calendar.getWeeksPerMonth(); week++) {
        /** @type {?} */
        let weekObject = month.weeks[week];
        if (!weekObject) {
            weekObject = month.weeks[week] = { number: 0, days: [], collapsed: true };
        }
        /** @type {?} */
        const days = weekObject.days;
        // week has days
        for (let day = 0; day < calendar.getDaysPerWeek(); day++) {
            if (week === 0) {
                month.weekdays[day] = calendar.getWeekday(date);
            }
            /** @type {?} */
            const newDate = new NgbDate(date.year, date.month, date.day);
            /** @type {?} */
            const nextDate = calendar.getNext(newDate);
            /** @type {?} */
            const ariaLabel = i18n.getDayAriaLabel(newDate);
            // marking date as disabled
            /** @type {?} */
            let disabled = !!((minDate && newDate.before(minDate)) || (maxDate && newDate.after(maxDate)));
            if (!disabled && markDisabled) {
                disabled = markDisabled(newDate, { month: month.number, year: month.year });
            }
            // adding user-provided data to the context
            /** @type {?} */
            let contextUserData = dayTemplateData ? dayTemplateData(newDate, { month: month.number, year: month.year }) : undefined;
            // saving first date of the month
            if (month.firstDate === null && newDate.month === month.number) {
                month.firstDate = newDate;
            }
            // saving last date of the month
            if (newDate.month === month.number && nextDate.month !== month.number) {
                month.lastDate = newDate;
            }
            /** @type {?} */
            let dayObject = days[day];
            if (!dayObject) {
                dayObject = days[day] = (/** @type {?} */ ({}));
            }
            dayObject.date = newDate;
            dayObject.context = Object.assign(dayObject.context || {}, {
                $implicit: newDate,
                date: newDate,
                data: contextUserData,
                currentMonth: month.number, disabled,
                focused: false,
                selected: false
            });
            dayObject.tabindex = -1;
            dayObject.ariaLabel = ariaLabel;
            dayObject.hidden = false;
            date = nextDate;
        }
        weekObject.number = calendar.getWeekNumber(days.map(day => day.date), firstDayOfWeek);
        // marking week as collapsed
        weekObject.collapsed = outsideDays === 'collapsed' && days[0].date.month !== month.number &&
            days[days.length - 1].date.month !== month.number;
    }
    return month;
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} firstDayOfWeek
 * @return {?}
 */
function getFirstViewDate(calendar, date, firstDayOfWeek) {
    /** @type {?} */
    const daysPerWeek = calendar.getDaysPerWeek();
    /** @type {?} */
    const firstMonthDate = new NgbDate(date.year, date.month, 1);
    /** @type {?} */
    const dayOfWeek = calendar.getWeekday(firstMonthDate) % daysPerWeek;
    return calendar.getPrev(firstMonthDate, 'd', (daysPerWeek + dayOfWeek - firstDayOfWeek) % daysPerWeek);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} locale
 * @return {?}
 */
function NGB_DATEPICKER_18N_FACTORY(locale) {
    return new NgbDatepickerI18nDefault(locale);
}
/**
 * Type of the service supplying month and weekday names to to NgbDatepicker component.
 * The default implementation of this service honors the Angular locale, and uses the registered locale data,
 * as explained in the Angular i18n guide.
 * See the i18n demo for how to extend this class and define a custom provider for i18n.
 * @abstract
 */
class NgbDatepickerI18n {
    /**
     * Returns the textual representation of a day that is rendered in a day cell
     *
     * \@since 3.0.0
     * @param {?} date
     * @return {?}
     */
    getDayNumerals(date) { return `${date.day}`; }
    /**
     * Returns the textual representation of a week number rendered by date picker
     *
     * \@since 3.0.0
     * @param {?} weekNumber
     * @return {?}
     */
    getWeekNumerals(weekNumber) { return `${weekNumber}`; }
    /**
     * Returns the textual representation of a year that is rendered
     * in date picker year select box
     *
     * \@since 3.0.0
     * @param {?} year
     * @return {?}
     */
    getYearNumerals(year) { return `${year}`; }
}
NgbDatepickerI18n.decorators = [
    { type: Injectable, args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_18N_FACTORY, deps: [LOCALE_ID] },] }
];
/** @nocollapse */ NgbDatepickerI18n.ngInjectableDef = defineInjectable({ factory: function NgbDatepickerI18n_Factory() { return NGB_DATEPICKER_18N_FACTORY(inject(LOCALE_ID)); }, token: NgbDatepickerI18n, providedIn: "root" });
class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
    /**
     * @param {?} _locale
     */
    constructor(_locale) {
        super();
        this._locale = _locale;
        /** @type {?} */
        const weekdaysStartingOnSunday = getLocaleDayNames(_locale, FormStyle.Standalone, TranslationWidth.Short);
        this._weekdaysShort = weekdaysStartingOnSunday.map((day, index) => weekdaysStartingOnSunday[(index + 1) % 7]);
        this._monthsShort = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
        this._monthsFull = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Wide);
    }
    /**
     * @param {?} weekday
     * @return {?}
     */
    getWeekdayShortName(weekday) { return this._weekdaysShort[weekday - 1]; }
    /**
     * @param {?} month
     * @return {?}
     */
    getMonthShortName(month) { return this._monthsShort[month - 1]; }
    /**
     * @param {?} month
     * @return {?}
     */
    getMonthFullName(month) { return this._monthsFull[month - 1]; }
    /**
     * @param {?} date
     * @return {?}
     */
    getDayAriaLabel(date) {
        /** @type {?} */
        const jsDate = new Date(date.year, date.month - 1, date.day);
        return formatDate(jsDate, 'fullDate', this._locale);
    }
}
NgbDatepickerI18nDefault.decorators = [
    { type: Injectable }
];
/** @nocollapse */
NgbDatepickerI18nDefault.ctorParameters = () => [
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerService {
    /**
     * @param {?} _calendar
     * @param {?} _i18n
     */
    constructor(_calendar, _i18n) {
        this._calendar = _calendar;
        this._i18n = _i18n;
        this._model$ = new Subject();
        this._select$ = new Subject();
        this._state = {
            disabled: false,
            displayMonths: 1,
            firstDayOfWeek: 1,
            focusVisible: false,
            months: [],
            navigation: 'select',
            outsideDays: 'visible',
            prevDisabled: false,
            nextDisabled: false,
            selectBoxes: { years: [], months: [] },
            selectedDate: null
        };
    }
    /**
     * @return {?}
     */
    get model$() { return this._model$.pipe(filter(model => model.months.length > 0)); }
    /**
     * @return {?}
     */
    get select$() { return this._select$.pipe(filter(date => date !== null)); }
    /**
     * @param {?} dayTemplateData
     * @return {?}
     */
    set dayTemplateData(dayTemplateData) {
        if (this._state.dayTemplateData !== dayTemplateData) {
            this._nextState({ dayTemplateData });
        }
    }
    /**
     * @param {?} disabled
     * @return {?}
     */
    set disabled(disabled) {
        if (this._state.disabled !== disabled) {
            this._nextState({ disabled });
        }
    }
    /**
     * @param {?} displayMonths
     * @return {?}
     */
    set displayMonths(displayMonths) {
        displayMonths = toInteger(displayMonths);
        if (isInteger(displayMonths) && displayMonths > 0 && this._state.displayMonths !== displayMonths) {
            this._nextState({ displayMonths });
        }
    }
    /**
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    set firstDayOfWeek(firstDayOfWeek) {
        firstDayOfWeek = toInteger(firstDayOfWeek);
        if (isInteger(firstDayOfWeek) && firstDayOfWeek >= 0 && this._state.firstDayOfWeek !== firstDayOfWeek) {
            this._nextState({ firstDayOfWeek });
        }
    }
    /**
     * @param {?} focusVisible
     * @return {?}
     */
    set focusVisible(focusVisible) {
        if (this._state.focusVisible !== focusVisible && !this._state.disabled) {
            this._nextState({ focusVisible });
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    set maxDate(date) {
        /** @type {?} */
        const maxDate = this.toValidDate(date, null);
        if (isChangedDate(this._state.maxDate, maxDate)) {
            this._nextState({ maxDate });
        }
    }
    /**
     * @param {?} markDisabled
     * @return {?}
     */
    set markDisabled(markDisabled) {
        if (this._state.markDisabled !== markDisabled) {
            this._nextState({ markDisabled });
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    set minDate(date) {
        /** @type {?} */
        const minDate = this.toValidDate(date, null);
        if (isChangedDate(this._state.minDate, minDate)) {
            this._nextState({ minDate });
        }
    }
    /**
     * @param {?} navigation
     * @return {?}
     */
    set navigation(navigation) {
        if (this._state.navigation !== navigation) {
            this._nextState({ navigation });
        }
    }
    /**
     * @param {?} outsideDays
     * @return {?}
     */
    set outsideDays(outsideDays) {
        if (this._state.outsideDays !== outsideDays) {
            this._nextState({ outsideDays });
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    focus(date) {
        if (!this._state.disabled && this._calendar.isValid(date) && isChangedDate(this._state.focusDate, date)) {
            this._nextState({ focusDate: date });
        }
    }
    /**
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    focusMove(period, number) {
        this.focus(this._calendar.getNext(this._state.focusDate, period, number));
    }
    /**
     * @return {?}
     */
    focusSelect() {
        if (isDateSelectable(this._state.focusDate, this._state)) {
            this.select(this._state.focusDate, { emitEvent: true });
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    open(date) {
        /** @type {?} */
        const firstDate = this.toValidDate(date, this._calendar.getToday());
        if (!this._state.disabled) {
            this._nextState({ firstDate });
        }
    }
    /**
     * @param {?} date
     * @param {?=} options
     * @return {?}
     */
    select(date, options = {}) {
        /** @type {?} */
        const selectedDate = this.toValidDate(date, null);
        if (!this._state.disabled) {
            if (isChangedDate(this._state.selectedDate, selectedDate)) {
                this._nextState({ selectedDate });
            }
            if (options.emitEvent && isDateSelectable(selectedDate, this._state)) {
                this._select$.next(selectedDate);
            }
        }
    }
    /**
     * @param {?} date
     * @param {?=} defaultValue
     * @return {?}
     */
    toValidDate(date, defaultValue) {
        /** @type {?} */
        const ngbDate = NgbDate.from(date);
        if (defaultValue === undefined) {
            defaultValue = this._calendar.getToday();
        }
        return this._calendar.isValid(ngbDate) ? ngbDate : defaultValue;
    }
    /**
     * @param {?} patch
     * @return {?}
     */
    _nextState(patch) {
        /** @type {?} */
        const newState = this._updateState(patch);
        this._patchContexts(newState);
        this._state = newState;
        this._model$.next(this._state);
    }
    /**
     * @param {?} state
     * @return {?}
     */
    _patchContexts(state) {
        const { months, displayMonths, selectedDate, focusDate, focusVisible, disabled, outsideDays } = state;
        state.months.forEach(month => {
            month.weeks.forEach(week => {
                week.days.forEach(day => {
                    // patch focus flag
                    if (focusDate) {
                        day.context.focused = focusDate.equals(day.date) && focusVisible;
                    }
                    // calculating tabindex
                    day.tabindex = !disabled && day.date.equals(focusDate) && focusDate.month === month.number ? 0 : -1;
                    // override context disabled
                    if (disabled === true) {
                        day.context.disabled = true;
                    }
                    // patch selection flag
                    if (selectedDate !== undefined) {
                        day.context.selected = selectedDate !== null && selectedDate.equals(day.date);
                    }
                    // visibility
                    if (month.number !== day.date.month) {
                        day.hidden = outsideDays === 'hidden' || outsideDays === 'collapsed' ||
                            (displayMonths > 1 && day.date.after(months[0].firstDate) &&
                                day.date.before(months[displayMonths - 1].lastDate));
                    }
                });
            });
        });
    }
    /**
     * @param {?} patch
     * @return {?}
     */
    _updateState(patch) {
        // patching fields
        /** @type {?} */
        const state = Object.assign({}, this._state, patch);
        /** @type {?} */
        let startDate = state.firstDate;
        // min/max dates changed
        if ('minDate' in patch || 'maxDate' in patch) {
            checkMinBeforeMax(state.minDate, state.maxDate);
            state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
            state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
            startDate = state.focusDate;
        }
        // disabled
        if ('disabled' in patch) {
            state.focusVisible = false;
        }
        // initial rebuild via 'select()'
        if ('selectedDate' in patch && this._state.months.length === 0) {
            startDate = state.selectedDate;
        }
        // focus date changed
        if ('focusDate' in patch) {
            state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
            startDate = state.focusDate;
            // nothing to rebuild if only focus changed and it is still visible
            if (state.months.length !== 0 && !state.focusDate.before(state.firstDate) &&
                !state.focusDate.after(state.lastDate)) {
                return state;
            }
        }
        // first date changed
        if ('firstDate' in patch) {
            state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
            startDate = state.firstDate;
        }
        // rebuilding months
        if (startDate) {
            /** @type {?} */
            const forceRebuild = 'dayTemplateData' in patch || 'firstDayOfWeek' in patch || 'markDisabled' in patch ||
                'minDate' in patch || 'maxDate' in patch || 'disabled' in patch || 'outsideDays' in patch;
            /** @type {?} */
            const months = buildMonths(this._calendar, startDate, state, this._i18n, forceRebuild);
            // updating months and boundary dates
            state.months = months;
            state.firstDate = months.length > 0 ? months[0].firstDate : undefined;
            state.lastDate = months.length > 0 ? months[months.length - 1].lastDate : undefined;
            // reset selected date if 'markDisabled' returns true
            if ('selectedDate' in patch && !isDateSelectable(state.selectedDate, state)) {
                state.selectedDate = null;
            }
            // adjusting focus after months were built
            if ('firstDate' in patch) {
                if (state.focusDate === undefined || state.focusDate.before(state.firstDate) ||
                    state.focusDate.after(state.lastDate)) {
                    state.focusDate = startDate;
                }
            }
            // adjusting months/years for the select box navigation
            /** @type {?} */
            const yearChanged = !this._state.firstDate || this._state.firstDate.year !== state.firstDate.year;
            /** @type {?} */
            const monthChanged = !this._state.firstDate || this._state.firstDate.month !== state.firstDate.month;
            if (state.navigation === 'select') {
                // years ->  boundaries (min/max were changed)
                if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.years.length === 0 || yearChanged) {
                    state.selectBoxes.years = generateSelectBoxYears(state.firstDate, state.minDate, state.maxDate);
                }
                // months -> when current year or boundaries change
                if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.months.length === 0 || yearChanged) {
                    state.selectBoxes.months =
                        generateSelectBoxMonths(this._calendar, state.firstDate, state.minDate, state.maxDate);
                }
            }
            else {
                state.selectBoxes = { years: [], months: [] };
            }
            // updating navigation arrows -> boundaries change (min/max) or month/year changes
            if ((state.navigation === 'arrows' || state.navigation === 'select') &&
                (monthChanged || yearChanged || 'minDate' in patch || 'maxDate' in patch || 'disabled' in patch)) {
                state.prevDisabled = state.disabled || prevMonthDisabled(this._calendar, state.firstDate, state.minDate);
                state.nextDisabled = state.disabled || nextMonthDisabled(this._calendar, state.lastDate, state.maxDate);
            }
        }
        return state;
    }
}
NgbDatepickerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
NgbDatepickerService.ctorParameters = () => [
    { type: NgbCalendar },
    { type: NgbDatepickerI18n }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
const Key = {
    Tab: 9,
    Enter: 13,
    Escape: 27,
    Space: 32,
    PageUp: 33,
    PageDown: 34,
    End: 35,
    Home: 36,
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
};
Key[Key.Tab] = 'Tab';
Key[Key.Enter] = 'Enter';
Key[Key.Escape] = 'Escape';
Key[Key.Space] = 'Space';
Key[Key.PageUp] = 'PageUp';
Key[Key.PageDown] = 'PageDown';
Key[Key.End] = 'End';
Key[Key.Home] = 'Home';
Key[Key.ArrowLeft] = 'ArrowLeft';
Key[Key.ArrowUp] = 'ArrowUp';
Key[Key.ArrowRight] = 'ArrowRight';
Key[Key.ArrowDown] = 'ArrowDown';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerKeyMapService {
    /**
     * @param {?} _service
     * @param {?} _calendar
     */
    constructor(_service, _calendar) {
        this._service = _service;
        this._calendar = _calendar;
        _service.model$.subscribe(model => {
            this._minDate = model.minDate;
            this._maxDate = model.maxDate;
            this._firstViewDate = model.firstDate;
            this._lastViewDate = model.lastDate;
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    processKey(event) {
        // tslint:disable-next-line:deprecation
        const { which } = event;
        if (Key[toString(which)]) {
            switch (which) {
                case Key.PageUp:
                    this._service.focusMove(event.shiftKey ? 'y' : 'm', -1);
                    break;
                case Key.PageDown:
                    this._service.focusMove(event.shiftKey ? 'y' : 'm', 1);
                    break;
                case Key.End:
                    this._service.focus(event.shiftKey ? this._maxDate : this._lastViewDate);
                    break;
                case Key.Home:
                    this._service.focus(event.shiftKey ? this._minDate : this._firstViewDate);
                    break;
                case Key.ArrowLeft:
                    this._service.focusMove('d', -1);
                    break;
                case Key.ArrowUp:
                    this._service.focusMove('d', -this._calendar.getDaysPerWeek());
                    break;
                case Key.ArrowRight:
                    this._service.focusMove('d', 1);
                    break;
                case Key.ArrowDown:
                    this._service.focusMove('d', this._calendar.getDaysPerWeek());
                    break;
                case Key.Enter:
                case Key.Space:
                    this._service.focusSelect();
                    break;
                default:
                    return;
            }
            event.preventDefault();
            event.stopPropagation();
        }
    }
}
NgbDatepickerKeyMapService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
NgbDatepickerKeyMapService.ctorParameters = () => [
    { type: NgbDatepickerService },
    { type: NgbCalendar }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
const NavigationEvent = {
    PREV: 0,
    NEXT: 1,
};
NavigationEvent[NavigationEvent.PREV] = 'PREV';
NavigationEvent[NavigationEvent.NEXT] = 'NEXT';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbDatepicker component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
class NgbDatepickerConfig {
    constructor() {
        this.displayMonths = 1;
        this.firstDayOfWeek = 1;
        this.navigation = 'select';
        this.outsideDays = 'visible';
        this.showWeekdays = true;
        this.showWeekNumbers = false;
    }
}
NgbDatepickerConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbDatepickerConfig.ngInjectableDef = defineInjectable({ factory: function NgbDatepickerConfig_Factory() { return new NgbDatepickerConfig(); }, token: NgbDatepickerConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @return {?}
 */
function NGB_DATEPICKER_DATE_ADAPTER_FACTORY() {
    return new NgbDateStructAdapter();
}
/**
 * An abstract class used as the DI token that does conversion between the internal
 * datepicker NgbDateStruct model and any provided user date model, ex. string, native date, etc.
 *
 * Adapter is used for conversion when binding datepicker to a model with forms, ex. [(ngModel)]="userDateModel"
 *
 * Default implementation assumes NgbDateStruct for user model as well.
 * @abstract
 * @template D
 */
class NgbDateAdapter {
}
NgbDateAdapter.decorators = [
    { type: Injectable, args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_DATE_ADAPTER_FACTORY },] }
];
/** @nocollapse */ NgbDateAdapter.ngInjectableDef = defineInjectable({ factory: NGB_DATEPICKER_DATE_ADAPTER_FACTORY, token: NgbDateAdapter, providedIn: "root" });
class NgbDateStructAdapter extends NgbDateAdapter {
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     * @param {?} date
     * @return {?}
     */
    fromModel(date) {
        return (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) ?
            { year: date.year, month: date.month, day: date.day } :
            null;
    }
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     * @param {?} date
     * @return {?}
     */
    toModel(date) {
        return (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) ?
            { year: date.year, month: date.month, day: date.day } :
            null;
    }
}
NgbDateStructAdapter.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbDatepicker),
    multi: true
};
/**
 * A lightweight and highly configurable datepicker directive
 */
class NgbDatepicker {
    /**
     * @param {?} _keyMapService
     * @param {?} _service
     * @param {?} _calendar
     * @param {?} i18n
     * @param {?} config
     * @param {?} _cd
     * @param {?} _elementRef
     * @param {?} _ngbDateAdapter
     * @param {?} _ngZone
     */
    constructor(_keyMapService, _service, _calendar, i18n, config, _cd, _elementRef, _ngbDateAdapter, _ngZone) {
        this._keyMapService = _keyMapService;
        this._service = _service;
        this._calendar = _calendar;
        this.i18n = i18n;
        this._cd = _cd;
        this._elementRef = _elementRef;
        this._ngbDateAdapter = _ngbDateAdapter;
        this._ngZone = _ngZone;
        /**
         * An event fired when navigation happens and currently displayed month changes.
         * See NgbDatepickerNavigateEvent for the payload info.
         */
        this.navigate = new EventEmitter();
        /**
         * An event fired when user selects a date using keyboard or mouse.
         * The payload of the event is currently selected NgbDate.
         */
        this.select = new EventEmitter();
        this.onChange = (_) => { };
        this.onTouched = () => { };
        ['dayTemplate', 'dayTemplateData', 'displayMonths', 'firstDayOfWeek', 'footerTemplate', 'markDisabled', 'minDate',
            'maxDate', 'navigation', 'outsideDays', 'showWeekdays', 'showWeekNumbers', 'startDate']
            .forEach(input => this[input] = config[input]);
        this._selectSubscription = _service.select$.subscribe(date => { this.select.emit(date); });
        this._subscription = _service.model$.subscribe(model => {
            /** @type {?} */
            const newDate = model.firstDate;
            /** @type {?} */
            const oldDate = this.model ? this.model.firstDate : null;
            /** @type {?} */
            const newSelectedDate = model.selectedDate;
            /** @type {?} */
            const newFocusedDate = model.focusDate;
            /** @type {?} */
            const oldFocusedDate = this.model ? this.model.focusDate : null;
            this.model = model;
            // handling selection change
            if (isChangedDate(newSelectedDate, this._controlValue)) {
                this._controlValue = newSelectedDate;
                this.onTouched();
                this.onChange(this._ngbDateAdapter.toModel(newSelectedDate));
            }
            // handling focus change
            if (isChangedDate(newFocusedDate, oldFocusedDate) && oldFocusedDate && model.focusVisible) {
                this.focus();
            }
            // emitting navigation event if the first month changes
            if (!newDate.equals(oldDate)) {
                this.navigate.emit({
                    current: oldDate ? { year: oldDate.year, month: oldDate.month } : null,
                    next: { year: newDate.year, month: newDate.month }
                });
            }
            _cd.markForCheck();
        });
    }
    /**
     * Manually focus the focusable day in the datepicker
     * @return {?}
     */
    focus() {
        this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            /** @type {?} */
            const elementToFocus = this._elementRef.nativeElement.querySelector('div.ngb-dp-day[tabindex="0"]');
            if (elementToFocus) {
                elementToFocus.focus();
            }
        });
    }
    /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     * Use 'startDate' input as an alternative
     * @param {?=} date
     * @return {?}
     */
    navigateTo(date) {
        this._service.open(NgbDate.from(date ? date.day ? (/** @type {?} */ (date)) : Object.assign({}, date, { day: 1 }) : null));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._subscription.unsubscribe();
        this._selectSubscription.unsubscribe();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.model === undefined) {
            ['dayTemplateData', 'displayMonths', 'markDisabled', 'firstDayOfWeek', 'navigation', 'minDate', 'maxDate',
                'outsideDays']
                .forEach(input => this._service[input] = this[input]);
            this.navigateTo(this.startDate);
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        ['dayTemplateData', 'displayMonths', 'markDisabled', 'firstDayOfWeek', 'navigation', 'minDate', 'maxDate',
            'outsideDays']
            .filter(input => input in changes)
            .forEach(input => this._service[input] = this[input]);
        if ('startDate' in changes) {
            this.navigateTo(this.startDate);
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    onDateSelect(date) {
        this._service.focus(date);
        this._service.select(date, { emitEvent: true });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeyDown(event) { this._keyMapService.processKey(event); }
    /**
     * @param {?} date
     * @return {?}
     */
    onNavigateDateSelect(date) { this._service.open(date); }
    /**
     * @param {?} event
     * @return {?}
     */
    onNavigateEvent(event) {
        switch (event) {
            case NavigationEvent.PREV:
                this._service.open(this._calendar.getPrev(this.model.firstDate, 'm', 1));
                break;
            case NavigationEvent.NEXT:
                this._service.open(this._calendar.getNext(this.model.firstDate, 'm', 1));
                break;
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) { this._service.disabled = isDisabled; }
    /**
     * @param {?} focusVisible
     * @return {?}
     */
    showFocus(focusVisible) { this._service.focusVisible = focusVisible; }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this._controlValue = NgbDate.from(this._ngbDateAdapter.fromModel(value));
        this._service.select(this._controlValue);
    }
}
NgbDatepicker.decorators = [
    { type: Component, args: [{
                exportAs: 'ngbDatepicker',
                selector: 'ngb-datepicker',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: `
    <ng-template #dt let-date="date" let-currentMonth="currentMonth" let-selected="selected" let-disabled="disabled" let-focused="focused">
      <div ngbDatepickerDayView
        [date]="date"
        [currentMonth]="currentMonth"
        [selected]="selected"
        [disabled]="disabled"
        [focused]="focused">
      </div>
    </ng-template>

    <div class="ngb-dp-header bg-light">
      <ngb-datepicker-navigation *ngIf="navigation !== 'none'"
        [date]="model.firstDate"
        [months]="model.months"
        [disabled]="model.disabled"
        [showSelect]="model.navigation === 'select'"
        [prevDisabled]="model.prevDisabled"
        [nextDisabled]="model.nextDisabled"
        [selectBoxes]="model.selectBoxes"
        (navigate)="onNavigateEvent($event)"
        (select)="onNavigateDateSelect($event)">
      </ngb-datepicker-navigation>
    </div>

    <div class="ngb-dp-months" (keydown)="onKeyDown($event)" (focusin)="showFocus(true)" (focusout)="showFocus(false)">
      <ng-template ngFor let-month [ngForOf]="model.months" let-i="index">
        <div class="ngb-dp-month">
          <div *ngIf="navigation === 'none' || (displayMonths > 1 && navigation === 'select')"
                class="ngb-dp-month-name bg-light">
            {{ i18n.getMonthFullName(month.number, month.year) }} {{ i18n.getYearNumerals(month.year) }}
          </div>
          <ngb-datepicker-month-view
            [month]="month"
            [dayTemplate]="dayTemplate || dt"
            [showWeekdays]="showWeekdays"
            [showWeekNumbers]="showWeekNumbers"
            (select)="onDateSelect($event)">
          </ngb-datepicker-month-view>
        </div>
      </ng-template>
    </div>

    <ng-template [ngTemplateOutlet]="footerTemplate"></ng-template>
  `,
                providers: [NGB_DATEPICKER_VALUE_ACCESSOR, NgbDatepickerService, NgbDatepickerKeyMapService],
                styles: ["ngb-datepicker{border:1px solid #dfdfdf;border-radius:.25rem;display:inline-block}.ngb-dp-month{pointer-events:none}.ngb-dp-header{border-bottom:0;border-radius:.25rem .25rem 0 0;padding-top:.25rem}ngb-datepicker-month-view{pointer-events:auto}.ngb-dp-month-name{font-size:larger;height:2rem;line-height:2rem;text-align:center}.ngb-dp-month+.ngb-dp-month>.ngb-dp-month-name,.ngb-dp-month+.ngb-dp-month>ngb-datepicker-month-view>.ngb-dp-week{padding-left:1rem}.ngb-dp-month:last-child .ngb-dp-week{padding-right:.25rem}.ngb-dp-month:first-child .ngb-dp-week{padding-left:.25rem}.ngb-dp-month>ngb-datepicker-month-view>.ngb-dp-week:last-child{padding-bottom:.25rem}.ngb-dp-months{display:-ms-flexbox;display:flex}"]
            }] }
];
/** @nocollapse */
NgbDatepicker.ctorParameters = () => [
    { type: NgbDatepickerKeyMapService },
    { type: NgbDatepickerService },
    { type: NgbCalendar },
    { type: NgbDatepickerI18n },
    { type: NgbDatepickerConfig },
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgbDateAdapter },
    { type: NgZone }
];
NgbDatepicker.propDecorators = {
    dayTemplate: [{ type: Input }],
    dayTemplateData: [{ type: Input }],
    displayMonths: [{ type: Input }],
    firstDayOfWeek: [{ type: Input }],
    footerTemplate: [{ type: Input }],
    markDisabled: [{ type: Input }],
    maxDate: [{ type: Input }],
    minDate: [{ type: Input }],
    navigation: [{ type: Input }],
    outsideDays: [{ type: Input }],
    showWeekdays: [{ type: Input }],
    showWeekNumbers: [{ type: Input }],
    startDate: [{ type: Input }],
    navigate: [{ type: Output }],
    select: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerMonthView {
    /**
     * @param {?} i18n
     */
    constructor(i18n) {
        this.i18n = i18n;
        this.select = new EventEmitter();
    }
    /**
     * @param {?} day
     * @return {?}
     */
    doSelect(day) {
        if (!day.context.disabled && !day.hidden) {
            this.select.emit(day.date);
        }
    }
}
NgbDatepickerMonthView.decorators = [
    { type: Component, args: [{
                selector: 'ngb-datepicker-month-view',
                host: { 'role': 'grid' },
                encapsulation: ViewEncapsulation.None,
                template: `
    <div *ngIf="showWeekdays" class="ngb-dp-week ngb-dp-weekdays bg-light">
      <div *ngIf="showWeekNumbers" class="ngb-dp-weekday ngb-dp-showweek"></div>
      <div *ngFor="let w of month.weekdays" class="ngb-dp-weekday small">
        {{ i18n.getWeekdayShortName(w) }}
      </div>
    </div>
    <ng-template ngFor let-week [ngForOf]="month.weeks">
      <div *ngIf="!week.collapsed" class="ngb-dp-week" role="row">
        <div *ngIf="showWeekNumbers" class="ngb-dp-week-number small text-muted">{{ i18n.getWeekNumerals(week.number) }}</div>
        <div *ngFor="let day of week.days" (click)="doSelect(day)" class="ngb-dp-day" role="gridcell"
          [class.disabled]="day.context.disabled"
          [tabindex]="day.tabindex"
          [class.hidden]="day.hidden"
          [attr.aria-label]="day.ariaLabel">
          <ng-template [ngIf]="!day.hidden">
            <ng-template [ngTemplateOutlet]="dayTemplate" [ngTemplateOutletContext]="day.context"></ng-template>
          </ng-template>
        </div>
      </div>
    </ng-template>
  `,
                styles: ["ngb-datepicker-month-view{display:block}.ngb-dp-week-number,.ngb-dp-weekday{line-height:2rem;text-align:center;font-style:italic}.ngb-dp-weekday{color:#5bc0de;color:var(--info)}.ngb-dp-week{border-radius:.25rem;display:-ms-flexbox;display:flex}.ngb-dp-weekdays{border-bottom:1px solid rgba(0,0,0,.125);border-radius:0}.ngb-dp-day,.ngb-dp-week-number,.ngb-dp-weekday{width:2rem;height:2rem}.ngb-dp-day{cursor:pointer}.ngb-dp-day.disabled,.ngb-dp-day.hidden{cursor:default}"]
            }] }
];
/** @nocollapse */
NgbDatepickerMonthView.ctorParameters = () => [
    { type: NgbDatepickerI18n }
];
NgbDatepickerMonthView.propDecorators = {
    dayTemplate: [{ type: Input }],
    month: [{ type: Input }],
    showWeekdays: [{ type: Input }],
    showWeekNumbers: [{ type: Input }],
    select: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerNavigation {
    /**
     * @param {?} i18n
     */
    constructor(i18n) {
        this.i18n = i18n;
        this.navigation = NavigationEvent;
        this.months = [];
        this.navigate = new EventEmitter();
        this.select = new EventEmitter();
    }
}
NgbDatepickerNavigation.decorators = [
    { type: Component, args: [{
                selector: 'ngb-datepicker-navigation',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: `
    <div class="ngb-dp-arrow">
      <button type="button" class="btn btn-link ngb-dp-arrow-btn" (click)="navigate.emit(navigation.PREV)" [disabled]="prevDisabled"
              i18n-aria-label="@@ngb.datepicker.previous-month" aria-label="Previous month"
              i18n-title="@@ngb.datepicker.previous-month" title="Previous month">
        <span class="ngb-dp-navigation-chevron"></span>
      </button>
    </div>
    <ngb-datepicker-navigation-select *ngIf="showSelect" class="ngb-dp-navigation-select"
      [date]="date"
      [disabled] = "disabled"
      [months]="selectBoxes.months"
      [years]="selectBoxes.years"
      (select)="select.emit($event)">
    </ngb-datepicker-navigation-select>

    <ng-template *ngIf="!showSelect" ngFor let-month [ngForOf]="months" let-i="index">
      <div class="ngb-dp-arrow" *ngIf="i > 0"></div>
      <div class="ngb-dp-month-name">
        {{ i18n.getMonthFullName(month.number, month.year) }} {{ i18n.getYearNumerals(month.year) }}
      </div>
      <div class="ngb-dp-arrow" *ngIf="i !== months.length - 1"></div>
    </ng-template>
    <div class="ngb-dp-arrow right">
      <button type="button" class="btn btn-link ngb-dp-arrow-btn" (click)="navigate.emit(navigation.NEXT)" [disabled]="nextDisabled"
              i18n-aria-label="@@ngb.datepicker.next-month" aria-label="Next month"
              i18n-title="@@ngb.datepicker.next-month" title="Next month">
        <span class="ngb-dp-navigation-chevron"></span>
      </button>
    </div>
    `,
                styles: ["ngb-datepicker-navigation{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.ngb-dp-navigation-chevron{border-style:solid;border-width:.2em .2em 0 0;display:inline-block;width:.75em;height:.75em;margin-left:.25em;margin-right:.15em;-webkit-transform:rotate(-135deg);transform:rotate(-135deg)}.right .ngb-dp-navigation-chevron{-webkit-transform:rotate(45deg);transform:rotate(45deg);margin-left:.15em;margin-right:.25em}.ngb-dp-arrow{display:-ms-flexbox;display:flex;-ms-flex:1 1 auto;flex:1 1 auto;padding-right:0;padding-left:0;margin:0;width:2rem;height:2rem}.ngb-dp-arrow.right{-ms-flex-pack:end;justify-content:flex-end}.ngb-dp-arrow-btn{padding:0 .25rem;margin:0 .5rem;border:none;background-color:transparent;z-index:1}.ngb-dp-arrow-btn:focus{outline-width:1px;outline-style:auto}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.ngb-dp-arrow-btn:focus{outline-style:solid}}.ngb-dp-month-name{font-size:larger;height:2rem;line-height:2rem;text-align:center}.ngb-dp-navigation-select{display:-ms-flexbox;display:flex;-ms-flex:1 1 9rem;flex:1 1 9rem}"]
            }] }
];
/** @nocollapse */
NgbDatepickerNavigation.ctorParameters = () => [
    { type: NgbDatepickerI18n }
];
NgbDatepickerNavigation.propDecorators = {
    date: [{ type: Input }],
    disabled: [{ type: Input }],
    months: [{ type: Input }],
    showSelect: [{ type: Input }],
    prevDisabled: [{ type: Input }],
    nextDisabled: [{ type: Input }],
    selectBoxes: [{ type: Input }],
    navigate: [{ type: Output }],
    select: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const FOCUSABLE_ELEMENTS_SELECTOR = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])',
    'textarea:not([disabled])', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'
].join(', ');
/**
 * Returns first and last focusable elements inside of a given element based on specific CSS selector
 * @param {?} element
 * @return {?}
 */
function getFocusableBoundaryElements(element) {
    /** @type {?} */
    const list = Array.from((/** @type {?} */ (element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR))))
        .filter(el => el.tabIndex !== -1);
    return [list[0], list[list.length - 1]];
}
/**
 * Function that enforces browser focus to be trapped inside a DOM element.
 *
 * Works only for clicks inside the element and navigation with 'Tab', ignoring clicks outside of the element
 *
 * \@param element The element around which focus will be trapped inside
 * \@param stopFocusTrap$ The observable stream. When completed the focus trap will clean up listeners
 * and free internal resources
 * \@param refocusOnClick Put the focus back to the last focused element whenever a click occurs on element (default to
 * false)
 * @type {?}
 */
const ngbFocusTrap = (element, stopFocusTrap$, refocusOnClick = false) => {
    // last focused element
    /** @type {?} */
    const lastFocusedElement$ = fromEvent(element, 'focusin').pipe(takeUntil(stopFocusTrap$), map(e => e.target));
    // 'tab' / 'shift+tab' stream
    fromEvent(element, 'keydown')
        .pipe(takeUntil(stopFocusTrap$), 
    // tslint:disable:deprecation
    filter(e => e.which === Key.Tab), 
    // tslint:enable:deprecation
    withLatestFrom(lastFocusedElement$))
        .subscribe(([tabEvent, focusedElement]) => {
        const [first, last] = getFocusableBoundaryElements(element);
        if ((focusedElement === first || focusedElement === element) && tabEvent.shiftKey) {
            last.focus();
            tabEvent.preventDefault();
        }
        if (focusedElement === last && !tabEvent.shiftKey) {
            first.focus();
            tabEvent.preventDefault();
        }
    });
    // inside click
    if (refocusOnClick) {
        fromEvent(element, 'click')
            .pipe(takeUntil(stopFocusTrap$), withLatestFrom(lastFocusedElement$), map(arr => (/** @type {?} */ (arr[1]))))
            .subscribe(lastFocusedElement => lastFocusedElement.focus());
    }
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// previous version:
// https://github.com/angular-ui/bootstrap/blob/07c31d0731f7cb068a1932b8e01d2312b796b4ec/src/position/position.js
class Positioning {
    /**
     * @param {?} element
     * @return {?}
     */
    getAllStyles(element) { return window.getComputedStyle(element); }
    /**
     * @param {?} element
     * @param {?} prop
     * @return {?}
     */
    getStyle(element, prop) { return this.getAllStyles(element)[prop]; }
    /**
     * @param {?} element
     * @return {?}
     */
    isStaticPositioned(element) {
        return (this.getStyle(element, 'position') || 'static') === 'static';
    }
    /**
     * @param {?} element
     * @return {?}
     */
    offsetParent(element) {
        /** @type {?} */
        let offsetParentEl = (/** @type {?} */ (element.offsetParent)) || document.documentElement;
        while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStaticPositioned(offsetParentEl)) {
            offsetParentEl = (/** @type {?} */ (offsetParentEl.offsetParent));
        }
        return offsetParentEl || document.documentElement;
    }
    /**
     * @param {?} element
     * @param {?=} round
     * @return {?}
     */
    position(element, round = true) {
        /** @type {?} */
        let elPosition;
        /** @type {?} */
        let parentOffset = { width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0 };
        if (this.getStyle(element, 'position') === 'fixed') {
            elPosition = element.getBoundingClientRect();
        }
        else {
            /** @type {?} */
            const offsetParentEl = this.offsetParent(element);
            elPosition = this.offset(element, false);
            if (offsetParentEl !== document.documentElement) {
                parentOffset = this.offset(offsetParentEl, false);
            }
            parentOffset.top += offsetParentEl.clientTop;
            parentOffset.left += offsetParentEl.clientLeft;
        }
        elPosition.top -= parentOffset.top;
        elPosition.bottom -= parentOffset.top;
        elPosition.left -= parentOffset.left;
        elPosition.right -= parentOffset.left;
        if (round) {
            elPosition.top = Math.round(elPosition.top);
            elPosition.bottom = Math.round(elPosition.bottom);
            elPosition.left = Math.round(elPosition.left);
            elPosition.right = Math.round(elPosition.right);
        }
        return elPosition;
    }
    /**
     * @param {?} element
     * @param {?=} round
     * @return {?}
     */
    offset(element, round = true) {
        /** @type {?} */
        const elBcr = element.getBoundingClientRect();
        /** @type {?} */
        const viewportOffset = {
            top: window.pageYOffset - document.documentElement.clientTop,
            left: window.pageXOffset - document.documentElement.clientLeft
        };
        /** @type {?} */
        let elOffset = {
            height: elBcr.height || element.offsetHeight,
            width: elBcr.width || element.offsetWidth,
            top: elBcr.top + viewportOffset.top,
            bottom: elBcr.bottom + viewportOffset.top,
            left: elBcr.left + viewportOffset.left,
            right: elBcr.right + viewportOffset.left
        };
        if (round) {
            elOffset.height = Math.round(elOffset.height);
            elOffset.width = Math.round(elOffset.width);
            elOffset.top = Math.round(elOffset.top);
            elOffset.bottom = Math.round(elOffset.bottom);
            elOffset.left = Math.round(elOffset.left);
            elOffset.right = Math.round(elOffset.right);
        }
        return elOffset;
    }
    /**
     * @param {?} hostElement
     * @param {?} targetElement
     * @param {?} placement
     * @param {?=} appendToBody
     * @return {?}
     */
    positionElements(hostElement, targetElement, placement, appendToBody) {
        /** @type {?} */
        const hostElPosition = appendToBody ? this.offset(hostElement, false) : this.position(hostElement, false);
        /** @type {?} */
        const targetElStyles = this.getAllStyles(targetElement);
        /** @type {?} */
        const targetElBCR = targetElement.getBoundingClientRect();
        /** @type {?} */
        const placementPrimary = placement.split('-')[0] || 'top';
        /** @type {?} */
        const placementSecondary = placement.split('-')[1] || 'center';
        /** @type {?} */
        let targetElPosition = {
            'height': targetElBCR.height || targetElement.offsetHeight,
            'width': targetElBCR.width || targetElement.offsetWidth,
            'top': 0,
            'bottom': targetElBCR.height || targetElement.offsetHeight,
            'left': 0,
            'right': targetElBCR.width || targetElement.offsetWidth
        };
        switch (placementPrimary) {
            case 'top':
                targetElPosition.top =
                    hostElPosition.top - (targetElement.offsetHeight + parseFloat(targetElStyles.marginBottom));
                break;
            case 'bottom':
                targetElPosition.top = hostElPosition.top + hostElPosition.height;
                break;
            case 'left':
                targetElPosition.left =
                    hostElPosition.left - (targetElement.offsetWidth + parseFloat(targetElStyles.marginRight));
                break;
            case 'right':
                targetElPosition.left = hostElPosition.left + hostElPosition.width;
                break;
        }
        switch (placementSecondary) {
            case 'top':
                targetElPosition.top = hostElPosition.top;
                break;
            case 'bottom':
                targetElPosition.top = hostElPosition.top + hostElPosition.height - targetElement.offsetHeight;
                break;
            case 'left':
                targetElPosition.left = hostElPosition.left;
                break;
            case 'right':
                targetElPosition.left = hostElPosition.left + hostElPosition.width - targetElement.offsetWidth;
                break;
            case 'center':
                if (placementPrimary === 'top' || placementPrimary === 'bottom') {
                    targetElPosition.left = hostElPosition.left + hostElPosition.width / 2 - targetElement.offsetWidth / 2;
                }
                else {
                    targetElPosition.top = hostElPosition.top + hostElPosition.height / 2 - targetElement.offsetHeight / 2;
                }
                break;
        }
        targetElPosition.top = Math.round(targetElPosition.top);
        targetElPosition.bottom = Math.round(targetElPosition.bottom);
        targetElPosition.left = Math.round(targetElPosition.left);
        targetElPosition.right = Math.round(targetElPosition.right);
        return targetElPosition;
    }
    // get the available placements of the target element in the viewport depending on the host element
    /**
     * @param {?} hostElement
     * @param {?} targetElement
     * @return {?}
     */
    getAvailablePlacements(hostElement, targetElement) {
        /** @type {?} */
        let availablePlacements = [];
        /** @type {?} */
        let hostElemClientRect = hostElement.getBoundingClientRect();
        /** @type {?} */
        let targetElemClientRect = targetElement.getBoundingClientRect();
        /** @type {?} */
        let html = document.documentElement;
        /** @type {?} */
        let windowHeight = window.innerHeight || html.clientHeight;
        /** @type {?} */
        let windowWidth = window.innerWidth || html.clientWidth;
        /** @type {?} */
        let hostElemClientRectHorCenter = hostElemClientRect.left + hostElemClientRect.width / 2;
        /** @type {?} */
        let hostElemClientRectVerCenter = hostElemClientRect.top + hostElemClientRect.height / 2;
        // left: check if target width can be placed between host left and viewport start and also height of target is
        // inside viewport
        if (targetElemClientRect.width < hostElemClientRect.left) {
            // check for left only
            if (hostElemClientRectVerCenter > targetElemClientRect.height / 2 &&
                windowHeight - hostElemClientRectVerCenter > targetElemClientRect.height / 2) {
                availablePlacements.splice(availablePlacements.length, 1, 'left');
            }
            // check for left-top and left-bottom
            this.setSecondaryPlacementForLeftRight(hostElemClientRect, targetElemClientRect, 'left', availablePlacements);
        }
        // top: target height is less than host top
        if (targetElemClientRect.height < hostElemClientRect.top) {
            if (hostElemClientRectHorCenter > targetElemClientRect.width / 2 &&
                windowWidth - hostElemClientRectHorCenter > targetElemClientRect.width / 2) {
                availablePlacements.splice(availablePlacements.length, 1, 'top');
            }
            this.setSecondaryPlacementForTopBottom(hostElemClientRect, targetElemClientRect, 'top', availablePlacements);
        }
        // right: check if target width can be placed between host right and viewport end and also height of target is
        // inside viewport
        if (windowWidth - hostElemClientRect.right > targetElemClientRect.width) {
            // check for right only
            if (hostElemClientRectVerCenter > targetElemClientRect.height / 2 &&
                windowHeight - hostElemClientRectVerCenter > targetElemClientRect.height / 2) {
                availablePlacements.splice(availablePlacements.length, 1, 'right');
            }
            // check for right-top and right-bottom
            this.setSecondaryPlacementForLeftRight(hostElemClientRect, targetElemClientRect, 'right', availablePlacements);
        }
        // bottom: check if there is enough space between host bottom and viewport end for target height
        if (windowHeight - hostElemClientRect.bottom > targetElemClientRect.height) {
            if (hostElemClientRectHorCenter > targetElemClientRect.width / 2 &&
                windowWidth - hostElemClientRectHorCenter > targetElemClientRect.width / 2) {
                availablePlacements.splice(availablePlacements.length, 1, 'bottom');
            }
            this.setSecondaryPlacementForTopBottom(hostElemClientRect, targetElemClientRect, 'bottom', availablePlacements);
        }
        return availablePlacements;
    }
    /**
     * check if secondary placement for left and right are available i.e. left-top, left-bottom, right-top, right-bottom
     * primaryplacement: left|right
     * availablePlacementArr: array in which available placements to be set
     * @param {?} hostElemClientRect
     * @param {?} targetElemClientRect
     * @param {?} primaryPlacement
     * @param {?} availablePlacementArr
     * @return {?}
     */
    setSecondaryPlacementForLeftRight(hostElemClientRect, targetElemClientRect, primaryPlacement, availablePlacementArr) {
        /** @type {?} */
        let html = document.documentElement;
        // check for left-bottom
        if (targetElemClientRect.height <= hostElemClientRect.bottom) {
            availablePlacementArr.splice(availablePlacementArr.length, 1, primaryPlacement + '-bottom');
        }
        if ((window.innerHeight || html.clientHeight) - hostElemClientRect.top >= targetElemClientRect.height) {
            availablePlacementArr.splice(availablePlacementArr.length, 1, primaryPlacement + '-top');
        }
    }
    /**
     * check if secondary placement for top and bottom are available i.e. top-left, top-right, bottom-left, bottom-right
     * primaryplacement: top|bottom
     * availablePlacementArr: array in which available placements to be set
     * @param {?} hostElemClientRect
     * @param {?} targetElemClientRect
     * @param {?} primaryPlacement
     * @param {?} availablePlacementArr
     * @return {?}
     */
    setSecondaryPlacementForTopBottom(hostElemClientRect, targetElemClientRect, primaryPlacement, availablePlacementArr) {
        /** @type {?} */
        let html = document.documentElement;
        // check for left-bottom
        if ((window.innerWidth || html.clientWidth) - hostElemClientRect.left >= targetElemClientRect.width) {
            availablePlacementArr.splice(availablePlacementArr.length, 1, primaryPlacement + '-left');
        }
        if (targetElemClientRect.width <= hostElemClientRect.right) {
            availablePlacementArr.splice(availablePlacementArr.length, 1, primaryPlacement + '-right');
        }
    }
}
/** @type {?} */
const positionService = new Positioning();
/*
 * Accept the placement array and applies the appropriate placement dependent on the viewport.
 * Returns the applied placement.
 * In case of auto placement, placements are selected in order
 *   'top', 'bottom', 'left', 'right',
 *   'top-left', 'top-right',
 *   'bottom-left', 'bottom-right',
 *   'left-top', 'left-bottom',
 *   'right-top', 'right-bottom'.
 * */
/**
 * @param {?} hostElement
 * @param {?} targetElement
 * @param {?} placement
 * @param {?=} appendToBody
 * @return {?}
 */
function positionElements(hostElement, targetElement, placement, appendToBody) {
    /** @type {?} */
    let placementVals = Array.isArray(placement) ? placement : [(/** @type {?} */ (placement))];
    // replace auto placement with other placements
    /** @type {?} */
    let hasAuto = placementVals.findIndex(val => val === 'auto');
    if (hasAuto >= 0) {
        ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'left-top',
            'left-bottom', 'right-top', 'right-bottom',
        ].forEach(function (obj) {
            if (placementVals.find(val => val.search('^' + obj) !== -1) == null) {
                placementVals.splice(hasAuto++, 1, (/** @type {?} */ (obj)));
            }
        });
    }
    // coordinates where to position
    /** @type {?} */
    let topVal = 0;
    /** @type {?} */
    let leftVal = 0;
    /** @type {?} */
    let appliedPlacement;
    // get available placements
    /** @type {?} */
    let availablePlacements = positionService.getAvailablePlacements(hostElement, targetElement);
    // iterate over all the passed placements
    for (let { item, index } of toItemIndexes(placementVals)) {
        // check if passed placement is present in the available placement or otherwise apply the last placement in the
        // passed placement list
        if ((availablePlacements.find(val => val === item) != null) || (placementVals.length === index + 1)) {
            appliedPlacement = (/** @type {?} */ (item));
            /** @type {?} */
            const pos = positionService.positionElements(hostElement, targetElement, item, appendToBody);
            topVal = pos.top;
            leftVal = pos.left;
            break;
        }
    }
    targetElement.style.top = `${topVal}px`;
    targetElement.style.left = `${leftVal}px`;
    return appliedPlacement;
}
// function to get index and item of an array
/**
 * @template T
 * @param {?} a
 * @return {?}
 */
function toItemIndexes(a) {
    return a.map((item, index) => ({ item, index }));
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @return {?}
 */
function NGB_DATEPICKER_PARSER_FORMATTER_FACTORY() {
    return new NgbDateISOParserFormatter();
}
/**
 * Abstract type serving as a DI token for the service parsing and formatting dates for the NgbInputDatepicker
 * directive. A default implementation using the ISO 8601 format is provided, but you can provide another implementation
 * to use an alternative format.
 * @abstract
 */
class NgbDateParserFormatter {
}
NgbDateParserFormatter.decorators = [
    { type: Injectable, args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_PARSER_FORMATTER_FACTORY },] }
];
/** @nocollapse */ NgbDateParserFormatter.ngInjectableDef = defineInjectable({ factory: NGB_DATEPICKER_PARSER_FORMATTER_FACTORY, token: NgbDateParserFormatter, providedIn: "root" });
class NgbDateISOParserFormatter extends NgbDateParserFormatter {
    /**
     * @param {?} value
     * @return {?}
     */
    parse(value) {
        if (value) {
            /** @type {?} */
            const dateParts = value.trim().split('-');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return { year: toInteger(dateParts[0]), month: null, day: null };
            }
            else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null };
            }
            else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2]) };
            }
        }
        return null;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    format(date) {
        return date ?
            `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
            '';
    }
}
NgbDateISOParserFormatter.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_DATEPICKER_VALUE_ACCESSOR$1 = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbInputDatepicker),
    multi: true
};
/** @type {?} */
const NGB_DATEPICKER_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => NgbInputDatepicker),
    multi: true
};
/**
 * A directive that makes it possible to have datepickers on input fields.
 * Manages integration with the input field itself (data entry) and ngModel (validation etc.).
 */
class NgbInputDatepicker {
    /**
     * @param {?} _parserFormatter
     * @param {?} _elRef
     * @param {?} _vcRef
     * @param {?} _renderer
     * @param {?} _cfr
     * @param {?} _ngZone
     * @param {?} _service
     * @param {?} _calendar
     * @param {?} _dateAdapter
     * @param {?} _document
     */
    constructor(_parserFormatter, _elRef, _vcRef, _renderer, _cfr, _ngZone, _service, _calendar, _dateAdapter, _document) {
        this._parserFormatter = _parserFormatter;
        this._elRef = _elRef;
        this._vcRef = _vcRef;
        this._renderer = _renderer;
        this._cfr = _cfr;
        this._ngZone = _ngZone;
        this._service = _service;
        this._calendar = _calendar;
        this._dateAdapter = _dateAdapter;
        this._document = _document;
        this._closed$ = new Subject();
        this._cRef = null;
        this._disabled = false;
        /**
         * Indicates whether the datepicker popup should be closed automatically after date selection / outside click or not.
         *
         * By default the popup will close on both date selection and outside click. If the value is 'false' the popup has to
         * be closed manually via '.close()' or '.toggle()' methods. If the value is set to 'inside' the popup will close on
         * date selection only. For the 'outside' the popup will close only on the outside click.
         *
         * \@since 3.0.0
         */
        this.autoClose = true;
        /**
         * Placement of a datepicker popup accepts:
         *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
         *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
         * and array of above values.
         */
        this.placement = 'bottom-left';
        /**
         * An event fired when user selects a date using keyboard or mouse.
         * The payload of the event is currently selected NgbDate.
         *
         * \@since 1.1.1
         */
        this.dateSelect = new EventEmitter();
        /**
         * An event fired when navigation happens and currently displayed month changes.
         * See NgbDatepickerNavigateEvent for the payload info.
         */
        this.navigate = new EventEmitter();
        this._onChange = (_) => { };
        this._onTouched = () => { };
        this._validatorChange = () => { };
        this._zoneSubscription = _ngZone.onStable.subscribe(() => {
            if (this._cRef) {
                positionElements(this._elRef.nativeElement, this._cRef.location.nativeElement, this.placement, this.container === 'body');
            }
        });
    }
    /**
     * @return {?}
     */
    get disabled() {
        return this._disabled;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = value === '' || (value && value !== 'false');
        if (this.isOpen()) {
            this._cRef.instance.setDisabledState(this._disabled);
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this._onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this._onTouched = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnValidatorChange(fn) { this._validatorChange = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        /** @type {?} */
        const value = c.value;
        if (value === null || value === undefined) {
            return null;
        }
        /** @type {?} */
        const ngbDate = this._fromDateStruct(this._dateAdapter.fromModel(value));
        if (!this._calendar.isValid(ngbDate)) {
            return { 'ngbDate': { invalid: c.value } };
        }
        if (this.minDate && ngbDate.before(NgbDate.from(this.minDate))) {
            return { 'ngbDate': { requiredBefore: this.minDate } };
        }
        if (this.maxDate && ngbDate.after(NgbDate.from(this.maxDate))) {
            return { 'ngbDate': { requiredAfter: this.maxDate } };
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this._model = this._fromDateStruct(this._dateAdapter.fromModel(value));
        this._writeModelValue(this._model);
    }
    /**
     * @param {?} value
     * @param {?=} updateView
     * @return {?}
     */
    manualDateChange(value, updateView = false) {
        /** @type {?} */
        const inputValueChanged = value !== this._inputValue;
        if (inputValueChanged) {
            this._inputValue = value;
            this._model = this._fromDateStruct(this._parserFormatter.parse(value));
        }
        if (inputValueChanged || !updateView) {
            this._onChange(this._model ? this._dateAdapter.toModel(this._model) : (value === '' ? null : value));
        }
        if (updateView && this._model) {
            this._writeModelValue(this._model);
        }
    }
    /**
     * @return {?}
     */
    isOpen() { return !!this._cRef; }
    /**
     * Opens the datepicker with the selected date indicated by the ngModel value.
     * @return {?}
     */
    open() {
        if (!this.isOpen()) {
            /** @type {?} */
            const cf = this._cfr.resolveComponentFactory(NgbDatepicker);
            this._cRef = this._vcRef.createComponent(cf);
            this._applyPopupStyling(this._cRef.location.nativeElement);
            this._applyDatepickerInputs(this._cRef.instance);
            this._subscribeForDatepickerOutputs(this._cRef.instance);
            this._cRef.instance.ngOnInit();
            this._cRef.instance.writeValue(this._dateAdapter.toModel(this._model));
            // date selection event handling
            this._cRef.instance.registerOnChange((selectedDate) => {
                this.writeValue(selectedDate);
                this._onChange(selectedDate);
            });
            this._cRef.changeDetectorRef.detectChanges();
            this._cRef.instance.setDisabledState(this.disabled);
            if (this.container === 'body') {
                window.document.querySelector(this.container).appendChild(this._cRef.location.nativeElement);
            }
            // focus handling
            ngbFocusTrap(this._cRef.location.nativeElement, this._closed$, true);
            this._cRef.instance.focus();
            // closing on ESC and outside clicks
            if (this.autoClose) {
                this._ngZone.runOutsideAngular(() => {
                    /** @type {?} */
                    const escapes$ = fromEvent(this._document, 'keyup')
                        .pipe(takeUntil(this._closed$), 
                    // tslint:disable-next-line:deprecation
                    filter(e => e.which === Key.Escape));
                    /** @type {?} */
                    let outsideClicks$;
                    if (this.autoClose === true || this.autoClose === 'outside') {
                        // we don't know how the popup was opened, so if it was opened with a click,
                        // we have to skip the first one to avoid closing it immediately
                        /** @type {?} */
                        let isOpening = true;
                        requestAnimationFrame(() => isOpening = false);
                        outsideClicks$ = fromEvent(this._document, 'click')
                            .pipe(takeUntil(this._closed$), filter(event => !isOpening && this._shouldCloseOnOutsideClick(event)));
                    }
                    else {
                        outsideClicks$ = NEVER;
                    }
                    race([escapes$, outsideClicks$]).subscribe(() => this._ngZone.run(() => this.close()));
                });
            }
        }
    }
    /**
     * Closes the datepicker popup.
     * @return {?}
     */
    close() {
        if (this.isOpen()) {
            this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
            this._cRef = null;
            this._closed$.next();
        }
    }
    /**
     * Toggles the datepicker popup (opens when closed and closes when opened).
     * @return {?}
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     * Use 'startDate' input as an alternative
     * @param {?=} date
     * @return {?}
     */
    navigateTo(date) {
        if (this.isOpen()) {
            this._cRef.instance.navigateTo(date);
        }
    }
    /**
     * @return {?}
     */
    onBlur() { this._onTouched(); }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['minDate'] || changes['maxDate']) {
            this._validatorChange();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.close();
        this._zoneSubscription.unsubscribe();
    }
    /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    _applyDatepickerInputs(datepickerInstance) {
        ['dayTemplate', 'dayTemplateData', 'displayMonths', 'firstDayOfWeek', 'footerTemplate', 'markDisabled', 'minDate',
            'maxDate', 'navigation', 'outsideDays', 'showNavigation', 'showWeekdays', 'showWeekNumbers']
            .forEach((optionName) => {
            if (this[optionName] !== undefined) {
                datepickerInstance[optionName] = this[optionName];
            }
        });
        datepickerInstance.startDate = this.startDate || this._model;
    }
    /**
     * @param {?} nativeElement
     * @return {?}
     */
    _applyPopupStyling(nativeElement) {
        this._renderer.addClass(nativeElement, 'dropdown-menu');
        this._renderer.setStyle(nativeElement, 'padding', '0');
        this._renderer.addClass(nativeElement, 'show');
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _shouldCloseOnOutsideClick(event) {
        return ![this._elRef.nativeElement, this._cRef.location.nativeElement].some(el => el.contains(event.target));
    }
    /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    _subscribeForDatepickerOutputs(datepickerInstance) {
        datepickerInstance.navigate.subscribe(date => this.navigate.emit(date));
        datepickerInstance.select.subscribe(date => {
            this.dateSelect.emit(date);
            if (this.autoClose === true || this.autoClose === 'inside') {
                this.close();
            }
        });
    }
    /**
     * @param {?} model
     * @return {?}
     */
    _writeModelValue(model) {
        /** @type {?} */
        const value = this._parserFormatter.format(model);
        this._inputValue = value;
        this._renderer.setProperty(this._elRef.nativeElement, 'value', value);
        if (this.isOpen()) {
            this._cRef.instance.writeValue(this._dateAdapter.toModel(model));
            this._onTouched();
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    _fromDateStruct(date) {
        /** @type {?} */
        const ngbDate = date ? new NgbDate(date.year, date.month, date.day) : null;
        return this._calendar.isValid(ngbDate) ? ngbDate : null;
    }
}
NgbInputDatepicker.decorators = [
    { type: Directive, args: [{
                selector: 'input[ngbDatepicker]',
                exportAs: 'ngbDatepicker',
                host: {
                    '(input)': 'manualDateChange($event.target.value)',
                    '(change)': 'manualDateChange($event.target.value, true)',
                    '(blur)': 'onBlur()',
                    '[disabled]': 'disabled'
                },
                providers: [NGB_DATEPICKER_VALUE_ACCESSOR$1, NGB_DATEPICKER_VALIDATOR, NgbDatepickerService]
            },] }
];
/** @nocollapse */
NgbInputDatepicker.ctorParameters = () => [
    { type: NgbDateParserFormatter },
    { type: ElementRef },
    { type: ViewContainerRef },
    { type: Renderer2 },
    { type: ComponentFactoryResolver },
    { type: NgZone },
    { type: NgbDatepickerService },
    { type: NgbCalendar },
    { type: NgbDateAdapter },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
NgbInputDatepicker.propDecorators = {
    autoClose: [{ type: Input }],
    dayTemplate: [{ type: Input }],
    dayTemplateData: [{ type: Input }],
    displayMonths: [{ type: Input }],
    firstDayOfWeek: [{ type: Input }],
    footerTemplate: [{ type: Input }],
    markDisabled: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    navigation: [{ type: Input }],
    outsideDays: [{ type: Input }],
    placement: [{ type: Input }],
    showWeekdays: [{ type: Input }],
    showWeekNumbers: [{ type: Input }],
    startDate: [{ type: Input }],
    container: [{ type: Input }],
    dateSelect: [{ type: Output }],
    navigate: [{ type: Output }],
    disabled: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerDayView {
    /**
     * @param {?} i18n
     */
    constructor(i18n) {
        this.i18n = i18n;
    }
    /**
     * @return {?}
     */
    isMuted() { return !this.selected && (this.date.month !== this.currentMonth || this.disabled); }
}
NgbDatepickerDayView.decorators = [
    { type: Component, args: [{
                selector: '[ngbDatepickerDayView]',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                host: {
                    'class': 'btn-light',
                    '[class.bg-primary]': 'selected',
                    '[class.text-white]': 'selected',
                    '[class.text-muted]': 'isMuted()',
                    '[class.outside]': 'isMuted()',
                    '[class.active]': 'focused'
                },
                template: `{{ i18n.getDayNumerals(date) }}`,
                styles: ["[ngbDatepickerDayView]{text-align:center;width:2rem;height:2rem;line-height:2rem;border-radius:.25rem;background:0 0}[ngbDatepickerDayView].outside{opacity:.5}"]
            }] }
];
/** @nocollapse */
NgbDatepickerDayView.ctorParameters = () => [
    { type: NgbDatepickerI18n }
];
NgbDatepickerDayView.propDecorators = {
    currentMonth: [{ type: Input }],
    date: [{ type: Input }],
    disabled: [{ type: Input }],
    focused: [{ type: Input }],
    selected: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerNavigationSelect {
    /**
     * @param {?} i18n
     */
    constructor(i18n) {
        this.i18n = i18n;
        this.select = new EventEmitter();
    }
    /**
     * @param {?} month
     * @return {?}
     */
    changeMonth(month) { this.select.emit(new NgbDate(this.date.year, toInteger(month), 1)); }
    /**
     * @param {?} year
     * @return {?}
     */
    changeYear(year) { this.select.emit(new NgbDate(toInteger(year), this.date.month, 1)); }
}
NgbDatepickerNavigationSelect.decorators = [
    { type: Component, args: [{
                selector: 'ngb-datepicker-navigation-select',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: `
    <select
      [disabled]="disabled"
      class="custom-select"
      [value]="date?.month"
      i18n-aria-label="@@ngb.datepicker.select-month" aria-label="Select month"
      i18n-title="@@ngb.datepicker.select-month" title="Select month"
      (change)="changeMonth($event.target.value)">
        <option *ngFor="let m of months" [attr.aria-label]="i18n.getMonthFullName(m, date?.year)"
                [value]="m">{{ i18n.getMonthShortName(m, date?.year) }}</option>
    </select><select
      [disabled]="disabled"
      class="custom-select"
      [value]="date?.year"
      i18n-aria-label="@@ngb.datepicker.select-year" aria-label="Select year"
      i18n-title="@@ngb.datepicker.select-year" title="Select year"
      (change)="changeYear($event.target.value)">
        <option *ngFor="let y of years" [value]="y">{{ i18n.getYearNumerals(y) }}</option>
    </select>
  `,
                styles: ["ngb-datepicker-navigation-select>.custom-select{-ms-flex:1 1 auto;flex:1 1 auto;padding:0 .5rem;font-size:.875rem;height:1.85rem}"]
            }] }
];
/** @nocollapse */
NgbDatepickerNavigationSelect.ctorParameters = () => [
    { type: NgbDatepickerI18n }
];
NgbDatepickerNavigationSelect.propDecorators = {
    date: [{ type: Input }],
    disabled: [{ type: Input }],
    months: [{ type: Input }],
    years: [{ type: Input }],
    select: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @abstract
 */
class NgbCalendarHijri extends NgbCalendar {
    /**
     * @return {?}
     */
    getDaysPerWeek() { return 7; }
    /**
     * @return {?}
     */
    getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }
    /**
     * @return {?}
     */
    getWeeksPerMonth() { return 6; }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getNext(date, period = 'd', number = 1) {
        date = new NgbDate(date.year, date.month, date.day);
        switch (period) {
            case 'y':
                date = this._setYear(date, date.year + number);
                date.month = 1;
                date.day = 1;
                return date;
            case 'm':
                date = this._setMonth(date, date.month + number);
                date.day = 1;
                return date;
            case 'd':
                return this._setDay(date, date.day + number);
            default:
                return date;
        }
    }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    /**
     * @param {?} date
     * @return {?}
     */
    getWeekday(date) {
        /** @type {?} */
        const day = this.toGregorian(date).getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    /**
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    getWeekNumber(week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        /** @type {?} */
        const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        /** @type {?} */
        const date = week[thursdayIndex];
        /** @type {?} */
        const jsDate = this.toGregorian(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7)); // Thursday
        // Thursday
        /** @type {?} */
        const time = jsDate.getTime();
        /** @type {?} */
        const MuhDate = this.toGregorian(new NgbDate(date.year, 1, 1));
        return Math.floor(Math.round((time - MuhDate.getTime()) / 86400000) / 7) + 1;
    }
    /**
     * @return {?}
     */
    getToday() { return this.fromGregorian(new Date()); }
    /**
     * @param {?} date
     * @return {?}
     */
    isValid(date) {
        return date && isNumber(date.year) && isNumber(date.month) && isNumber(date.day) &&
            !isNaN(this.toGregorian(date).getTime());
    }
    /**
     * @param {?} date
     * @param {?} day
     * @return {?}
     */
    _setDay(date, day) {
        day = +day;
        /** @type {?} */
        let mDays = this.getDaysPerMonth(date.month, date.year);
        if (day <= 0) {
            while (day <= 0) {
                date = this._setMonth(date, date.month - 1);
                mDays = this.getDaysPerMonth(date.month, date.year);
                day += mDays;
            }
        }
        else if (day > mDays) {
            while (day > mDays) {
                day -= mDays;
                date = this._setMonth(date, date.month + 1);
                mDays = this.getDaysPerMonth(date.month, date.year);
            }
        }
        date.day = day;
        return date;
    }
    /**
     * @param {?} date
     * @param {?} month
     * @return {?}
     */
    _setMonth(date, month) {
        month = +month;
        date.year = date.year + Math.floor((month - 1) / 12);
        date.month = Math.floor(((month - 1) % 12 + 12) % 12) + 1;
        return date;
    }
    /**
     * @param {?} date
     * @param {?} year
     * @return {?}
     */
    _setYear(date, year) {
        date.year = +year;
        return date;
    }
}
NgbCalendarHijri.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Checks if islamic year is a leap year
 * @param {?} hYear
 * @return {?}
 */
function isIslamicLeapYear(hYear) {
    return (14 + 11 * hYear) % 30 < 11;
}
/**
 * Checks if gregorian years is a leap year
 * @param {?} gDate
 * @return {?}
 */
function isGregorianLeapYear(gDate) {
    /** @type {?} */
    const year = gDate.getFullYear();
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
/**
 * Returns the start of Hijri Month.
 * `hMonth` is 0 for Muharram, 1 for Safar, etc.
 * `hYear` is any Hijri hYear.
 * @param {?} hYear
 * @param {?} hMonth
 * @return {?}
 */
function getIslamicMonthStart(hYear, hMonth) {
    return Math.ceil(29.5 * hMonth) + (hYear - 1) * 354 + Math.floor((3 + 11 * hYear) / 30.0);
}
/**
 * Returns the start of Hijri year.
 * `year` is any Hijri year.
 * @param {?} year
 * @return {?}
 */
function getIslamicYearStart(year) {
    return (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0);
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function mod(a, b) {
    return a - b * Math.floor(a / b);
}
/**
 * The civil calendar is one type of Hijri calendars used in islamic countries.
 * Uses a fixed cycle of alternating 29- and 30-day months,
 * with a leap day added to the last month of 11 out of every 30 years.
 * http://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types
 * All the calculations here are based on the equations from "Calendrical Calculations" By Edward M. Reingold, Nachum
 * Dershowitz.
 * @type {?}
 */
const GREGORIAN_EPOCH = 1721425.5;
/** @type {?} */
const ISLAMIC_EPOCH = 1948439.5;
class NgbCalendarIslamicCivil extends NgbCalendarHijri {
    /**
     * Returns the equivalent islamic(civil) date value for a give input Gregorian date.
     * `gDate` is a JS Date to be converted to Hijri.
     * @param {?} gDate
     * @return {?}
     */
    fromGregorian(gDate) {
        /** @type {?} */
        const gYear = gDate.getFullYear();
        /** @type {?} */
        const gMonth = gDate.getMonth();
        /** @type {?} */
        const gDay = gDate.getDate();
        /** @type {?} */
        let julianDay = GREGORIAN_EPOCH - 1 + 365 * (gYear - 1) + Math.floor((gYear - 1) / 4) +
            -Math.floor((gYear - 1) / 100) + Math.floor((gYear - 1) / 400) +
            Math.floor((367 * (gMonth + 1) - 362) / 12 + (gMonth + 1 <= 2 ? 0 : isGregorianLeapYear(gDate) ? -1 : -2) + gDay);
        julianDay = Math.floor(julianDay) + 0.5;
        /** @type {?} */
        const days = julianDay - ISLAMIC_EPOCH;
        /** @type {?} */
        const hYear = Math.floor((30 * days + 10646) / 10631.0);
        /** @type {?} */
        let hMonth = Math.ceil((days - 29 - getIslamicYearStart(hYear)) / 29.5);
        hMonth = Math.min(hMonth, 11);
        /** @type {?} */
        const hDay = Math.ceil(days - getIslamicMonthStart(hYear, hMonth)) + 1;
        return new NgbDate(hYear, hMonth + 1, hDay);
    }
    /**
     * Returns the equivalent JS date value for a give input islamic(civil) date.
     * `hDate` is an islamic(civil) date to be converted to Gregorian.
     * @param {?} hDate
     * @return {?}
     */
    toGregorian(hDate) {
        /** @type {?} */
        const hYear = hDate.year;
        /** @type {?} */
        const hMonth = hDate.month - 1;
        /** @type {?} */
        const hDay = hDate.day;
        /** @type {?} */
        const julianDay = hDay + Math.ceil(29.5 * hMonth) + (hYear - 1) * 354 + Math.floor((3 + 11 * hYear) / 30) + ISLAMIC_EPOCH - 1;
        /** @type {?} */
        const wjd = Math.floor(julianDay - 0.5) + 0.5;
        /** @type {?} */
        const depoch = wjd - GREGORIAN_EPOCH;
        /** @type {?} */
        const quadricent = Math.floor(depoch / 146097);
        /** @type {?} */
        const dqc = mod(depoch, 146097);
        /** @type {?} */
        const cent = Math.floor(dqc / 36524);
        /** @type {?} */
        const dcent = mod(dqc, 36524);
        /** @type {?} */
        const quad = Math.floor(dcent / 1461);
        /** @type {?} */
        const dquad = mod(dcent, 1461);
        /** @type {?} */
        const yindex = Math.floor(dquad / 365);
        /** @type {?} */
        let year = quadricent * 400 + cent * 100 + quad * 4 + yindex;
        if (!(cent === 4 || yindex === 4)) {
            year++;
        }
        /** @type {?} */
        const gYearStart = GREGORIAN_EPOCH + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400);
        /** @type {?} */
        const yearday = wjd - gYearStart;
        /** @type {?} */
        const tjd = GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400) + Math.floor(739 / 12 + (isGregorianLeapYear(new Date(year, 3, 1)) ? -1 : -2) + 1);
        /** @type {?} */
        const leapadj = wjd < tjd ? 0 : isGregorianLeapYear(new Date(year, 3, 1)) ? 1 : 2;
        /** @type {?} */
        const month = Math.floor(((yearday + leapadj) * 12 + 373) / 367);
        /** @type {?} */
        const tjd2 = GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400) +
            Math.floor((367 * month - 362) / 12 + (month <= 2 ? 0 : isGregorianLeapYear(new Date(year, month - 1, 1)) ? -1 : -2) +
                1);
        /** @type {?} */
        const day = wjd - tjd2 + 1;
        return new Date(year, month - 1, day);
    }
    /**
     * Returns the number of days in a specific Hijri month.
     * `month` is 1 for Muharram, 2 for Safar, etc.
     * `year` is any Hijri year.
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    getDaysPerMonth(month, year) {
        year = year + Math.floor(month / 13);
        month = ((month - 1) % 12) + 1;
        /** @type {?} */
        let length = 29 + month % 2;
        if (month === 12 && isIslamicLeapYear(year)) {
            length++;
        }
        return length;
    }
}
NgbCalendarIslamicCivil.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Umalqura calendar is one type of Hijri calendars used in islamic countries.
 * This Calendar is used by Saudi Arabia for administrative purpose.
 * Unlike tabular calendars, the algorithm involves astronomical calculation, but it's still deterministic.
 * http://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types
 * @type {?}
 */
const GREGORIAN_FIRST_DATE = new Date(1882, 10, 12);
/** @type {?} */
const GREGORIAN_LAST_DATE = new Date(2174, 10, 25);
/** @type {?} */
const HIJRI_BEGIN = 1300;
/** @type {?} */
const HIJRI_END = 1600;
/** @type {?} */
const ONE_DAY = 1000 * 60 * 60 * 24;
/** @type {?} */
const MONTH_LENGTH = [
    // 1300-1304
    '101010101010', '110101010100', '111011001001', '011011010100', '011011101010',
    // 1305-1309
    '001101101100', '101010101101', '010101010101', '011010101001', '011110010010',
    // 1310-1314
    '101110101001', '010111010100', '101011011010', '010101011100', '110100101101',
    // 1315-1319
    '011010010101', '011101001010', '101101010100', '101101101010', '010110101101',
    // 1320-1324
    '010010101110', '101001001111', '010100010111', '011010001011', '011010100101',
    // 1325-1329
    '101011010101', '001011010110', '100101011011', '010010011101', '101001001101',
    // 1330-1334
    '110100100110', '110110010101', '010110101100', '100110110110', '001010111010',
    // 1335-1339
    '101001011011', '010100101011', '101010010101', '011011001010', '101011101001',
    // 1340-1344
    '001011110100', '100101110110', '001010110110', '100101010110', '101011001010',
    // 1345-1349
    '101110100100', '101111010010', '010111011001', '001011011100', '100101101101',
    // 1350-1354
    '010101001101', '101010100101', '101101010010', '101110100101', '010110110100',
    // 1355-1359
    '100110110110', '010101010111', '001010010111', '010101001011', '011010100011',
    // 1360-1364
    '011101010010', '101101100101', '010101101010', '101010101011', '010100101011',
    // 1365-1369
    '110010010101', '110101001010', '110110100101', '010111001010', '101011010110',
    // 1370-1374
    '100101010111', '010010101011', '100101001011', '101010100101', '101101010010',
    // 1375-1379
    '101101101010', '010101110101', '001001110110', '100010110111', '010001011011',
    // 1380-1384
    '010101010101', '010110101001', '010110110100', '100111011010', '010011011101',
    // 1385-1389
    '001001101110', '100100110110', '101010101010', '110101010100', '110110110010',
    // 1390-1394
    '010111010101', '001011011010', '100101011011', '010010101011', '101001010101',
    // 1395-1399
    '101101001001', '101101100100', '101101110001', '010110110100', '101010110101',
    // 1400-1404
    '101001010101', '110100100101', '111010010010', '111011001001', '011011010100',
    // 1405-1409
    '101011101001', '100101101011', '010010101011', '101010010011', '110101001001',
    // 1410-1414
    '110110100100', '110110110010', '101010111001', '010010111010', '101001011011',
    // 1415-1419
    '010100101011', '101010010101', '101100101010', '101101010101', '010101011100',
    // 1420-1424
    '010010111101', '001000111101', '100100011101', '101010010101', '101101001010',
    // 1425-1429
    '101101011010', '010101101101', '001010110110', '100100111011', '010010011011',
    // 1430-1434
    '011001010101', '011010101001', '011101010100', '101101101010', '010101101100',
    // 1435-1439
    '101010101101', '010101010101', '101100101001', '101110010010', '101110101001',
    // 1440-1444
    '010111010100', '101011011010', '010101011010', '101010101011', '010110010101',
    // 1445-1449
    '011101001001', '011101100100', '101110101010', '010110110101', '001010110110',
    // 1450-1454
    '101001010110', '111001001101', '101100100101', '101101010010', '101101101010',
    // 1455-1459
    '010110101101', '001010101110', '100100101111', '010010010111', '011001001011',
    // 1460-1464
    '011010100101', '011010101100', '101011010110', '010101011101', '010010011101',
    // 1465-1469
    '101001001101', '110100010110', '110110010101', '010110101010', '010110110101',
    // 1470-1474
    '001011011010', '100101011011', '010010101101', '010110010101', '011011001010',
    // 1475-1479
    '011011100100', '101011101010', '010011110101', '001010110110', '100101010110',
    // 1480-1484
    '101010101010', '101101010100', '101111010010', '010111011001', '001011101010',
    // 1485-1489
    '100101101101', '010010101101', '101010010101', '101101001010', '101110100101',
    // 1490-1494
    '010110110010', '100110110101', '010011010110', '101010010111', '010101000111',
    // 1495-1499
    '011010010011', '011101001001', '101101010101', '010101101010', '101001101011',
    // 1500-1504
    '010100101011', '101010001011', '110101000110', '110110100011', '010111001010',
    // 1505-1509
    '101011010110', '010011011011', '001001101011', '100101001011', '101010100101',
    // 1510-1514
    '101101010010', '101101101001', '010101110101', '000101110110', '100010110111',
    // 1515-1519
    '001001011011', '010100101011', '010101100101', '010110110100', '100111011010',
    // 1520-1524
    '010011101101', '000101101101', '100010110110', '101010100110', '110101010010',
    // 1525-1529
    '110110101001', '010111010100', '101011011010', '100101011011', '010010101011',
    // 1530-1534
    '011001010011', '011100101001', '011101100010', '101110101001', '010110110010',
    // 1535-1539
    '101010110101', '010101010101', '101100100101', '110110010010', '111011001001',
    // 1540-1544
    '011011010010', '101011101001', '010101101011', '010010101011', '101001010101',
    // 1545-1549
    '110100101001', '110101010100', '110110101010', '100110110101', '010010111010',
    // 1550-1554
    '101000111011', '010010011011', '101001001101', '101010101010', '101011010101',
    // 1555-1559
    '001011011010', '100101011101', '010001011110', '101000101110', '110010011010',
    // 1560-1564
    '110101010101', '011010110010', '011010111001', '010010111010', '101001011101',
    // 1565-1569
    '010100101101', '101010010101', '101101010010', '101110101000', '101110110100',
    // 1570-1574
    '010110111001', '001011011010', '100101011010', '101101001010', '110110100100',
    // 1575-1579
    '111011010001', '011011101000', '101101101010', '010101101101', '010100110101',
    // 1580-1584
    '011010010101', '110101001010', '110110101000', '110111010100', '011011011010',
    // 1585-1589
    '010101011011', '001010011101', '011000101011', '101100010101', '101101001010',
    // 1590-1594
    '101110010101', '010110101010', '101010101110', '100100101110', '110010001111',
    // 1595-1599
    '010100100111', '011010010101', '011010101010', '101011010110', '010101011101',
    // 1600
    '001010011101'
];
/**
 * @param {?} date1
 * @param {?} date2
 * @return {?}
 */
function getDaysDiff(date1, date2) {
    /** @type {?} */
    const diff = Math.abs(date1.getTime() - date2.getTime());
    return Math.round(diff / ONE_DAY);
}
class NgbCalendarIslamicUmalqura extends NgbCalendarIslamicCivil {
    /**
     * Returns the equivalent islamic(Umalqura) date value for a give input Gregorian date.
     * `gdate` is s JS Date to be converted to Hijri.
     * @param {?} gDate
     * @return {?}
     */
    fromGregorian(gDate) {
        /** @type {?} */
        let hDay = 1;
        /** @type {?} */
        let hMonth = 0;
        /** @type {?} */
        let hYear = 1300;
        /** @type {?} */
        let daysDiff = getDaysDiff(gDate, GREGORIAN_FIRST_DATE);
        if (gDate.getTime() - GREGORIAN_FIRST_DATE.getTime() >= 0 && gDate.getTime() - GREGORIAN_LAST_DATE.getTime() <= 0) {
            /** @type {?} */
            let year = 1300;
            for (let i = 0; i < MONTH_LENGTH.length; i++, year++) {
                for (let j = 0; j < 12; j++) {
                    /** @type {?} */
                    let numOfDays = +MONTH_LENGTH[i][j] + 29;
                    if (daysDiff <= numOfDays) {
                        hDay = daysDiff + 1;
                        if (hDay > numOfDays) {
                            hDay = 1;
                            j++;
                        }
                        if (j > 11) {
                            j = 0;
                            year++;
                        }
                        hMonth = j;
                        hYear = year;
                        return new NgbDate(hYear, hMonth + 1, hDay);
                    }
                    daysDiff = daysDiff - numOfDays;
                }
            }
        }
        else {
            return super.fromGregorian(gDate);
        }
    }
    /**
     * Converts the current Hijri date to Gregorian.
     * @param {?} hDate
     * @return {?}
     */
    toGregorian(hDate) {
        /** @type {?} */
        const hYear = hDate.year;
        /** @type {?} */
        const hMonth = hDate.month - 1;
        /** @type {?} */
        const hDay = hDate.day;
        /** @type {?} */
        let gDate = new Date(GREGORIAN_FIRST_DATE);
        /** @type {?} */
        let dayDiff = hDay - 1;
        if (hYear >= HIJRI_BEGIN && hYear <= HIJRI_END) {
            for (let y = 0; y < hYear - HIJRI_BEGIN; y++) {
                for (let m = 0; m < 12; m++) {
                    dayDiff += +MONTH_LENGTH[y][m] + 29;
                }
            }
            for (let m = 0; m < hMonth; m++) {
                dayDiff += +MONTH_LENGTH[hYear - HIJRI_BEGIN][m] + 29;
            }
            gDate.setDate(GREGORIAN_FIRST_DATE.getDate() + dayDiff);
        }
        else {
            gDate = super.toGregorian(hDate);
        }
        return gDate;
    }
    /**
     * Returns the number of days in a specific Hijri hMonth.
     * `hMonth` is 1 for Muharram, 2 for Safar, etc.
     * `hYear` is any Hijri hYear.
     * @param {?} hMonth
     * @param {?} hYear
     * @return {?}
     */
    getDaysPerMonth(hMonth, hYear) {
        if (hYear >= HIJRI_BEGIN && hYear <= HIJRI_END) {
            /** @type {?} */
            const pos = hYear - HIJRI_BEGIN;
            return +MONTH_LENGTH[pos][hMonth - 1] + 29;
        }
        return super.getDaysPerMonth(hMonth, hYear);
    }
}
NgbCalendarIslamicUmalqura.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Returns the equivalent JS date value for a give input Jalali date.
 * `jalaliDate` is an Jalali date to be converted to Gregorian.
 * @param {?} jalaliDate
 * @return {?}
 */
function toGregorian(jalaliDate) {
    /** @type {?} */
    let jdn = jalaliToJulian(jalaliDate.year, jalaliDate.month, jalaliDate.day);
    /** @type {?} */
    let date = julianToGregorian(jdn);
    date.setHours(6, 30, 3, 200);
    return date;
}
/**
 * Returns the equivalent jalali date value for a give input Gregorian date.
 * `gdate` is a JS Date to be converted to jalali.
 * utc to local
 * @param {?} gdate
 * @return {?}
 */
function fromGregorian(gdate) {
    /** @type {?} */
    let g2d = gregorianToJulian(gdate.getFullYear(), gdate.getMonth() + 1, gdate.getDate());
    return julianToJalali(g2d);
}
/**
 * @param {?} date
 * @param {?} yearValue
 * @return {?}
 */
function setJalaliYear(date, yearValue) {
    date.year = +yearValue;
    return date;
}
/**
 * @param {?} date
 * @param {?} month
 * @return {?}
 */
function setJalaliMonth(date, month) {
    month = +month;
    date.year = date.year + Math.floor((month - 1) / 12);
    date.month = Math.floor(((month - 1) % 12 + 12) % 12) + 1;
    return date;
}
/**
 * @param {?} date
 * @param {?} day
 * @return {?}
 */
function setJalaliDay(date, day) {
    /** @type {?} */
    let mDays = getDaysPerMonth(date.month, date.year);
    if (day <= 0) {
        while (day <= 0) {
            date = setJalaliMonth(date, date.month - 1);
            mDays = getDaysPerMonth(date.month, date.year);
            day += mDays;
        }
    }
    else if (day > mDays) {
        while (day > mDays) {
            day -= mDays;
            date = setJalaliMonth(date, date.month + 1);
            mDays = getDaysPerMonth(date.month, date.year);
        }
    }
    date.day = day;
    return date;
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function mod$1(a, b) {
    return a - b * Math.floor(a / b);
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function div(a, b) {
    return Math.trunc(a / b);
}
/*
 This function determines if the Jalali (Persian) year is
 leap (366-day long) or is the common year (365 days), and
 finds the day in March (Gregorian calendar) of the first
 day of the Jalali year (jalaliYear).
 @param jalaliYear Jalali calendar year (-61 to 3177)
 @return
 leap: number of years since the last leap year (0 to 4)
 gYear: Gregorian year of the beginning of Jalali year
 march: the March day of Farvardin the 1st (1st day of jalaliYear)
 @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
 @see: http://www.fourmilab.ch/documents/calendar/
 */
/**
 * @param {?} jalaliYear
 * @return {?}
 */
function jalCal(jalaliYear) {
    // Jalali years starting the 33-year rule.
    /** @type {?} */
    let breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
    /** @type {?} */
    const breaksLength = breaks.length;
    /** @type {?} */
    const gYear = jalaliYear + 621;
    /** @type {?} */
    let leapJ = -14;
    /** @type {?} */
    let jp = breaks[0];
    if (jalaliYear < jp || jalaliYear >= breaks[breaksLength - 1]) {
        throw new Error('Invalid Jalali year ' + jalaliYear);
    }
    // Find the limiting years for the Jalali year jalaliYear.
    /** @type {?} */
    let jump;
    for (let i = 1; i < breaksLength; i += 1) {
        /** @type {?} */
        const jm = breaks[i];
        jump = jm - jp;
        if (jalaliYear < jm) {
            break;
        }
        leapJ = leapJ + div(jump, 33) * 8 + div(mod$1(jump, 33), 4);
        jp = jm;
    }
    /** @type {?} */
    let n = jalaliYear - jp;
    // Find the number of leap years from AD 621 to the beginning
    // of the current Jalali year in the Persian calendar.
    leapJ = leapJ + div(n, 33) * 8 + div(mod$1(n, 33) + 3, 4);
    if (mod$1(jump, 33) === 4 && jump - n === 4) {
        leapJ += 1;
    }
    // And the same in the Gregorian calendar (until the year gYear).
    /** @type {?} */
    const leapG = div(gYear, 4) - div((div(gYear, 100) + 1) * 3, 4) - 150;
    // Determine the Gregorian date of Farvardin the 1st.
    /** @type {?} */
    const march = 20 + leapJ - leapG;
    // Find how many years have passed since the last leap year.
    if (jump - n < 6) {
        n = n - jump + div(jump + 4, 33) * 33;
    }
    /** @type {?} */
    let leap = mod$1(mod$1(n + 1, 33) - 1, 4);
    if (leap === -1) {
        leap = 4;
    }
    return { leap: leap, gy: gYear, march: march };
}
/*
 Calculates Gregorian and Julian calendar dates from the Julian Day number
 (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
 calendars) to some millions years ahead of the present.
 @param jdn Julian Day number
 @return
 gYear: Calendar year (years BC numbered 0, -1, -2, ...)
 gMonth: Calendar month (1 to 12)
 gDay: Calendar day of the month M (1 to 28/29/30/31)
 */
/**
 * @param {?} julianDayNumber
 * @return {?}
 */
function julianToGregorian(julianDayNumber) {
    /** @type {?} */
    let j = 4 * julianDayNumber + 139361631;
    j = j + div(div(4 * julianDayNumber + 183187720, 146097) * 3, 4) * 4 - 3908;
    /** @type {?} */
    const i = div(mod$1(j, 1461), 4) * 5 + 308;
    /** @type {?} */
    const gDay = div(mod$1(i, 153), 5) + 1;
    /** @type {?} */
    const gMonth = mod$1(div(i, 153), 12) + 1;
    /** @type {?} */
    const gYear = div(j, 1461) - 100100 + div(8 - gMonth, 6);
    return new Date(gYear, gMonth - 1, gDay);
}
/*
 Converts a date of the Jalali calendar to the Julian Day number.
 @param jy Jalali year (1 to 3100)
 @param jm Jalali month (1 to 12)
 @param jd Jalali day (1 to 29/31)
 @return Julian Day number
 */
/**
 * @param {?} gy
 * @param {?} gm
 * @param {?} gd
 * @return {?}
 */
function gregorianToJulian(gy, gm, gd) {
    /** @type {?} */
    let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod$1(gm + 9, 12) + 2, 5) + gd - 34840408;
    d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
    return d;
}
/*
 Converts the Julian Day number to a date in the Jalali calendar.
 @param julianDayNumber Julian Day number
 @return
 jalaliYear: Jalali year (1 to 3100)
 jalaliMonth: Jalali month (1 to 12)
 jalaliDay: Jalali day (1 to 29/31)
 */
/**
 * @param {?} julianDayNumber
 * @return {?}
 */
function julianToJalali(julianDayNumber) {
    /** @type {?} */
    let gy = julianToGregorian(julianDayNumber).getFullYear() // Calculate Gregorian year (gy).
    ;
    /** @type {?} */
    let jalaliYear = gy - 621;
    /** @type {?} */
    let r = jalCal(jalaliYear);
    /** @type {?} */
    let gregorianDay = gregorianToJulian(gy, 3, r.march);
    /** @type {?} */
    let jalaliDay;
    /** @type {?} */
    let jalaliMonth;
    /** @type {?} */
    let numberOfDays;
    // Find number of days that passed since 1 Farvardin.
    numberOfDays = julianDayNumber - gregorianDay;
    if (numberOfDays >= 0) {
        if (numberOfDays <= 185) {
            // The first 6 months.
            jalaliMonth = 1 + div(numberOfDays, 31);
            jalaliDay = mod$1(numberOfDays, 31) + 1;
            return new NgbDate(jalaliYear, jalaliMonth, jalaliDay);
        }
        else {
            // The remaining months.
            numberOfDays -= 186;
        }
    }
    else {
        // Previous Jalali year.
        jalaliYear -= 1;
        numberOfDays += 179;
        if (r.leap === 1) {
            numberOfDays += 1;
        }
    }
    jalaliMonth = 7 + div(numberOfDays, 30);
    jalaliDay = mod$1(numberOfDays, 30) + 1;
    return new NgbDate(jalaliYear, jalaliMonth, jalaliDay);
}
/*
 Converts a date of the Jalali calendar to the Julian Day number.
 @param jYear Jalali year (1 to 3100)
 @param jMonth Jalali month (1 to 12)
 @param jDay Jalali day (1 to 29/31)
 @return Julian Day number
 */
/**
 * @param {?} jYear
 * @param {?} jMonth
 * @param {?} jDay
 * @return {?}
 */
function jalaliToJulian(jYear, jMonth, jDay) {
    /** @type {?} */
    let r = jalCal(jYear);
    return gregorianToJulian(r.gy, 3, r.march) + (jMonth - 1) * 31 - div(jMonth, 7) * (jMonth - 7) + jDay - 1;
}
/**
 * Returns the number of days in a specific jalali month.
 * @param {?} month
 * @param {?} year
 * @return {?}
 */
function getDaysPerMonth(month, year) {
    if (month <= 6) {
        return 31;
    }
    if (month <= 11) {
        return 30;
    }
    if (jalCal(year).leap === 0) {
        return 30;
    }
    return 29;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbCalendarPersian extends NgbCalendar {
    /**
     * @return {?}
     */
    getDaysPerWeek() { return 7; }
    /**
     * @return {?}
     */
    getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }
    /**
     * @return {?}
     */
    getWeeksPerMonth() { return 6; }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getNext(date, period = 'd', number = 1) {
        date = new NgbDate(date.year, date.month, date.day);
        switch (period) {
            case 'y':
                date = setJalaliYear(date, date.year + number);
                date.month = 1;
                date.day = 1;
                return date;
            case 'm':
                date = setJalaliMonth(date, date.month + number);
                date.day = 1;
                return date;
            case 'd':
                return setJalaliDay(date, date.day + number);
            default:
                return date;
        }
    }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    /**
     * @param {?} date
     * @return {?}
     */
    getWeekday(date) {
        /** @type {?} */
        const day = toGregorian(date).getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    /**
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    getWeekNumber(week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        /** @type {?} */
        const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        /** @type {?} */
        const date = week[thursdayIndex];
        /** @type {?} */
        const jsDate = toGregorian(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7)); // Thursday
        // Thursday
        /** @type {?} */
        const time = jsDate.getTime();
        /** @type {?} */
        const startDate = toGregorian(new NgbDate(date.year, 1, 1));
        return Math.floor(Math.round((time - startDate.getTime()) / 86400000) / 7) + 1;
    }
    /**
     * @return {?}
     */
    getToday() { return fromGregorian(new Date()); }
    /**
     * @param {?} date
     * @return {?}
     */
    isValid(date) {
        return date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day) &&
            !isNaN(toGregorian(date).getTime());
    }
}
NgbCalendarPersian.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const PARTS_PER_HOUR = 1080;
/** @type {?} */
const PARTS_PER_DAY = 24 * PARTS_PER_HOUR;
/** @type {?} */
const PARTS_FRACTIONAL_MONTH = 12 * PARTS_PER_HOUR + 793;
/** @type {?} */
const PARTS_PER_MONTH = 29 * PARTS_PER_DAY + PARTS_FRACTIONAL_MONTH;
/** @type {?} */
const BAHARAD = 11 * PARTS_PER_HOUR + 204;
/** @type {?} */
const HEBREW_DAY_ON_JAN_1_1970 = 2092591;
/** @type {?} */
const GREGORIAN_EPOCH$1 = 1721425.5;
/**
 * @param {?} year
 * @return {?}
 */
function isGregorianLeapYear$1(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
/**
 * @param {?} year
 * @return {?}
 */
function numberOfFirstDayInYear(year) {
    /** @type {?} */
    let monthsBeforeYear = Math.floor((235 * year - 234) / 19);
    /** @type {?} */
    let fractionalMonthsBeforeYear = monthsBeforeYear * PARTS_FRACTIONAL_MONTH + BAHARAD;
    /** @type {?} */
    let dayNumber = monthsBeforeYear * 29 + Math.floor(fractionalMonthsBeforeYear / PARTS_PER_DAY);
    /** @type {?} */
    let timeOfDay = fractionalMonthsBeforeYear % PARTS_PER_DAY;
    /** @type {?} */
    let dayOfWeek = dayNumber % 7;
    if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6) {
        dayNumber++;
        dayOfWeek = dayNumber % 7;
    }
    if (dayOfWeek === 1 && timeOfDay > 15 * PARTS_PER_HOUR + 204 && !isHebrewLeapYear(year)) {
        dayNumber += 2;
    }
    else if (dayOfWeek === 0 && timeOfDay > 21 * PARTS_PER_HOUR + 589 && isHebrewLeapYear(year - 1)) {
        dayNumber++;
    }
    return dayNumber;
}
/**
 * @param {?} month
 * @param {?} year
 * @return {?}
 */
function getDaysInGregorianMonth(month, year) {
    /** @type {?} */
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (isGregorianLeapYear$1(year)) {
        days[1]++;
    }
    return days[month - 1];
}
/**
 * @param {?} year
 * @return {?}
 */
function getHebrewMonths(year) {
    return isHebrewLeapYear(year) ? 13 : 12;
}
/**
 * Returns the number of days in a specific Hebrew year.
 * `year` is any Hebrew year.
 * @param {?} year
 * @return {?}
 */
function getDaysInHebrewYear(year) {
    return numberOfFirstDayInYear(year + 1) - numberOfFirstDayInYear(year);
}
/**
 * @param {?} year
 * @return {?}
 */
function isHebrewLeapYear(year) {
    /** @type {?} */
    let b = (year * 12 + 17) % 19;
    return b >= ((b < 0) ? -7 : 12);
}
/**
 * Returns the number of days in a specific Hebrew month.
 * `month` is 1 for Nisan, 2 for Iyar etc. Note: Hebrew leap year contains 13 months.
 * `year` is any Hebrew year.
 * @param {?} month
 * @param {?} year
 * @return {?}
 */
function getDaysInHebrewMonth(month, year) {
    /** @type {?} */
    let yearLength = numberOfFirstDayInYear(year + 1) - numberOfFirstDayInYear(year);
    /** @type {?} */
    let yearType = (yearLength <= 380 ? yearLength : (yearLength - 30)) - 353;
    /** @type {?} */
    let leapYear = isHebrewLeapYear(year);
    /** @type {?} */
    let daysInMonth = leapYear ? [30, 29, 29, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29] :
        [30, 29, 29, 29, 30, 29, 30, 29, 30, 29, 30, 29];
    if (yearType > 0) {
        daysInMonth[2]++; // Kislev gets an extra day in normal or complete years.
    }
    if (yearType > 1) {
        daysInMonth[1]++; // Heshvan gets an extra day in complete years only.
    }
    return daysInMonth[month - 1];
}
/**
 * @param {?} date
 * @return {?}
 */
function getDayNumberInHebrewYear(date) {
    /** @type {?} */
    let numberOfDay = 0;
    for (let i = 1; i < date.month; i++) {
        numberOfDay += getDaysInHebrewMonth(i, date.year);
    }
    return numberOfDay + date.day;
}
/**
 * @param {?} date
 * @param {?} val
 * @return {?}
 */
function setHebrewMonth(date, val) {
    /** @type {?} */
    let after = val >= 0;
    if (!after) {
        val = -val;
    }
    while (val > 0) {
        if (after) {
            if (val > getHebrewMonths(date.year) - date.month) {
                val -= getHebrewMonths(date.year) - date.month + 1;
                date.year++;
                date.month = 1;
            }
            else {
                date.month += val;
                val = 0;
            }
        }
        else {
            if (val >= date.month) {
                date.year--;
                val -= date.month;
                date.month = getHebrewMonths(date.year);
            }
            else {
                date.month -= val;
                val = 0;
            }
        }
    }
    return date;
}
/**
 * @param {?} date
 * @param {?} val
 * @return {?}
 */
function setHebrewDay(date, val) {
    /** @type {?} */
    let after = val >= 0;
    if (!after) {
        val = -val;
    }
    while (val > 0) {
        if (after) {
            if (val > getDaysInHebrewYear(date.year) - getDayNumberInHebrewYear(date)) {
                val -= getDaysInHebrewYear(date.year) - getDayNumberInHebrewYear(date) + 1;
                date.year++;
                date.month = 1;
                date.day = 1;
            }
            else if (val > getDaysInHebrewMonth(date.month, date.year) - date.day) {
                val -= getDaysInHebrewMonth(date.month, date.year) - date.day + 1;
                date.month++;
                date.day = 1;
            }
            else {
                date.day += val;
                val = 0;
            }
        }
        else {
            if (val >= date.day) {
                val -= date.day;
                date.month--;
                if (date.month === 0) {
                    date.year--;
                    date.month = getHebrewMonths(date.year);
                }
                date.day = getDaysInHebrewMonth(date.month, date.year);
            }
            else {
                date.day -= val;
                val = 0;
            }
        }
    }
    return date;
}
/**
 * Returns the equivalent Hebrew date value for a give input Gregorian date.
 * `gdate` is a JS Date to be converted to Hebrew date.
 * @param {?} gdate
 * @return {?}
 */
function fromGregorian$1(gdate) {
    /** @type {?} */
    const date = new Date(gdate);
    /** @type {?} */
    const gYear = date.getFullYear();
    /** @type {?} */
    const gMonth = date.getMonth();
    /** @type {?} */
    const gDay = date.getDate();
    /** @type {?} */
    let julianDay = GREGORIAN_EPOCH$1 - 1 + 365 * (gYear - 1) + Math.floor((gYear - 1) / 4) -
        Math.floor((gYear - 1) / 100) + Math.floor((gYear - 1) / 400) +
        Math.floor((367 * (gMonth + 1) - 362) / 12 + (gMonth + 1 <= 2 ? 0 : isGregorianLeapYear$1(gYear) ? -1 : -2) + gDay);
    julianDay = Math.floor(julianDay + 0.5);
    /** @type {?} */
    let daysSinceHebEpoch = julianDay - 347997;
    /** @type {?} */
    let monthsSinceHebEpoch = Math.floor(daysSinceHebEpoch * PARTS_PER_DAY / PARTS_PER_MONTH);
    /** @type {?} */
    let hYear = Math.floor((monthsSinceHebEpoch * 19 + 234) / 235) + 1;
    /** @type {?} */
    let firstDayOfThisYear = numberOfFirstDayInYear(hYear);
    /** @type {?} */
    let dayOfYear = daysSinceHebEpoch - firstDayOfThisYear;
    while (dayOfYear < 1) {
        hYear--;
        firstDayOfThisYear = numberOfFirstDayInYear(hYear);
        dayOfYear = daysSinceHebEpoch - firstDayOfThisYear;
    }
    /** @type {?} */
    let hMonth = 1;
    /** @type {?} */
    let hDay = dayOfYear;
    while (hDay > getDaysInHebrewMonth(hMonth, hYear)) {
        hDay -= getDaysInHebrewMonth(hMonth, hYear);
        hMonth++;
    }
    return new NgbDate(hYear, hMonth, hDay);
}
/**
 * Returns the equivalent JS date value for a given Hebrew date.
 * `hebrewDate` is an Hebrew date to be converted to Gregorian.
 * @param {?} hebrewDate
 * @return {?}
 */
function toGregorian$1(hebrewDate) {
    /** @type {?} */
    const hYear = hebrewDate.year;
    /** @type {?} */
    const hMonth = hebrewDate.month;
    /** @type {?} */
    const hDay = hebrewDate.day;
    /** @type {?} */
    let days = numberOfFirstDayInYear(hYear);
    for (let i = 1; i < hMonth; i++) {
        days += getDaysInHebrewMonth(i, hYear);
    }
    days += hDay;
    /** @type {?} */
    let diffDays = days - HEBREW_DAY_ON_JAN_1_1970;
    /** @type {?} */
    let after = diffDays >= 0;
    if (!after) {
        diffDays = -diffDays;
    }
    /** @type {?} */
    let gYear = 1970;
    /** @type {?} */
    let gMonth = 1;
    /** @type {?} */
    let gDay = 1;
    while (diffDays > 0) {
        if (after) {
            if (diffDays >= (isGregorianLeapYear$1(gYear) ? 366 : 365)) {
                diffDays -= isGregorianLeapYear$1(gYear) ? 366 : 365;
                gYear++;
            }
            else if (diffDays >= getDaysInGregorianMonth(gMonth, gYear)) {
                diffDays -= getDaysInGregorianMonth(gMonth, gYear);
                gMonth++;
            }
            else {
                gDay += diffDays;
                diffDays = 0;
            }
        }
        else {
            if (diffDays >= (isGregorianLeapYear$1(gYear - 1) ? 366 : 365)) {
                diffDays -= isGregorianLeapYear$1(gYear - 1) ? 366 : 365;
                gYear--;
            }
            else {
                if (gMonth > 1) {
                    gMonth--;
                }
                else {
                    gMonth = 12;
                    gYear--;
                }
                if (diffDays >= getDaysInGregorianMonth(gMonth, gYear)) {
                    diffDays -= getDaysInGregorianMonth(gMonth, gYear);
                }
                else {
                    gDay = getDaysInGregorianMonth(gMonth, gYear) - diffDays + 1;
                    diffDays = 0;
                }
            }
        }
    }
    return new Date(gYear, gMonth - 1, gDay);
}
/**
 * @param {?} numerals
 * @return {?}
 */
function hebrewNumerals(numerals) {
    if (!numerals) {
        return '';
    }
    /** @type {?} */
    const hArray0_9 = ['', '\u05d0', '\u05d1', '\u05d2', '\u05d3', '\u05d4', '\u05d5', '\u05d6', '\u05d7', '\u05d8'];
    /** @type {?} */
    const hArray10_19 = [
        '\u05d9', '\u05d9\u05d0', '\u05d9\u05d1', '\u05d9\u05d2', '\u05d9\u05d3', '\u05d8\u05d5', '\u05d8\u05d6',
        '\u05d9\u05d6', '\u05d9\u05d7', '\u05d9\u05d8'
    ];
    /** @type {?} */
    const hArray20_90 = ['', '', '\u05db', '\u05dc', '\u05de', '\u05e0', '\u05e1', '\u05e2', '\u05e4', '\u05e6'];
    /** @type {?} */
    const hArray100_900 = [
        '', '\u05e7', '\u05e8', '\u05e9', '\u05ea', '\u05ea\u05e7', '\u05ea\u05e8', '\u05ea\u05e9', '\u05ea\u05ea',
        '\u05ea\u05ea\u05e7'
    ];
    /** @type {?} */
    const hArray1000_9000 = [
        '', '\u05d0', '\u05d1', '\u05d1\u05d0', '\u05d1\u05d1', '\u05d4', '\u05d4\u05d0', '\u05d4\u05d1',
        '\u05d4\u05d1\u05d0', '\u05d4\u05d1\u05d1'
    ];
    /** @type {?} */
    const geresh = '\u05f3';
    /** @type {?} */
    const gershaim = '\u05f4';
    /** @type {?} */
    let mem = 0;
    /** @type {?} */
    let result = [];
    /** @type {?} */
    let step = 0;
    while (numerals > 0) {
        /** @type {?} */
        let m = numerals % 10;
        if (step === 0) {
            mem = m;
        }
        else if (step === 1) {
            if (m !== 1) {
                result.unshift(hArray20_90[m], hArray0_9[mem]);
            }
            else {
                result.unshift(hArray10_19[mem]);
            }
        }
        else if (step === 2) {
            result.unshift(hArray100_900[m]);
        }
        else {
            if (m !== 5) {
                result.unshift(hArray1000_9000[m], geresh, ' ');
            }
            break;
        }
        numerals = Math.floor(numerals / 10);
        if (step === 0 && numerals === 0) {
            result.unshift(hArray0_9[m]);
        }
        step++;
    }
    result = result.join('').split('');
    if (result.length === 1) {
        result.push(geresh);
    }
    else if (result.length > 1) {
        result.splice(result.length - 1, 0, gershaim);
    }
    return result.join('');
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * \@since 3.2.0
 */
class NgbCalendarHebrew extends NgbCalendar {
    /**
     * @return {?}
     */
    getDaysPerWeek() { return 7; }
    /**
     * @param {?=} year
     * @return {?}
     */
    getMonths(year) {
        if (year && isHebrewLeapYear(year)) {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        }
        else {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        }
    }
    /**
     * @return {?}
     */
    getWeeksPerMonth() { return 6; }
    /**
     * @param {?} date
     * @return {?}
     */
    isValid(date) {
        /** @type {?} */
        let b = date && isNumber(date.year) && isNumber(date.month) && isNumber(date.day);
        b = b && date.month > 0 && date.month <= (isHebrewLeapYear(date.year) ? 13 : 12);
        b = b && date.day > 0 && date.day <= getDaysInHebrewMonth(date.month, date.year);
        return b && !isNaN(toGregorian$1(date).getTime());
    }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getNext(date, period = 'd', number = 1) {
        date = new NgbDate(date.year, date.month, date.day);
        switch (period) {
            case 'y':
                date.year += number;
                date.month = 1;
                date.day = 1;
                return date;
            case 'm':
                date = setHebrewMonth(date, number);
                date.day = 1;
                return date;
            case 'd':
                return setHebrewDay(date, number);
            default:
                return date;
        }
    }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    /**
     * @param {?} date
     * @return {?}
     */
    getWeekday(date) {
        /** @type {?} */
        const day = toGregorian$1(date).getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    /**
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    getWeekNumber(week, firstDayOfWeek) {
        /** @type {?} */
        const date = week[week.length - 1];
        return Math.ceil(getDayNumberInHebrewYear(date) / 7);
    }
    /**
     * @return {?}
     */
    getToday() { return fromGregorian$1(new Date()); }
    /**
     * \@since 3.4.0
     * @param {?} date
     * @return {?}
     */
    toGregorian(date) { return fromJSDate(toGregorian$1(date)); }
    /**
     * \@since 3.4.0
     * @param {?} date
     * @return {?}
     */
    fromGregorian(date) { return fromGregorian$1(toJSDate(date)); }
}
NgbCalendarHebrew.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const WEEKDAYS = ['שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת', 'ראשון'];
/** @type {?} */
const MONTHS = ['תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר', 'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'];
/** @type {?} */
const MONTHS_LEAP = ['תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר א׳', 'אדר ב׳', 'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'];
/**
 * \@since 3.2.0
 */
class NgbDatepickerI18nHebrew extends NgbDatepickerI18n {
    /**
     * @param {?} month
     * @param {?=} year
     * @return {?}
     */
    getMonthShortName(month, year) { return this.getMonthFullName(month, year); }
    /**
     * @param {?} month
     * @param {?=} year
     * @return {?}
     */
    getMonthFullName(month, year) {
        return isHebrewLeapYear(year) ? MONTHS_LEAP[month - 1] : MONTHS[month - 1];
    }
    /**
     * @param {?} weekday
     * @return {?}
     */
    getWeekdayShortName(weekday) { return WEEKDAYS[weekday - 1]; }
    /**
     * @param {?} date
     * @return {?}
     */
    getDayAriaLabel(date) {
        return `${hebrewNumerals(date.day)} ${this.getMonthFullName(date.month, date.year)} ${hebrewNumerals(date.year)}`;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    getDayNumerals(date) { return hebrewNumerals(date.day); }
    /**
     * @param {?} weekNumber
     * @return {?}
     */
    getWeekNumerals(weekNumber) { return hebrewNumerals(weekNumber); }
    /**
     * @param {?} year
     * @return {?}
     */
    getYearNumerals(year) { return hebrewNumerals(year); }
}
NgbDatepickerI18nHebrew.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * NgbDateAdapter implementation that allows using native javascript date as a user date model.
 */
class NgbDateNativeAdapter extends NgbDateAdapter {
    /**
     * Converts native date to a NgbDateStruct
     * @param {?} date
     * @return {?}
     */
    fromModel(date) {
        return (date instanceof Date && !isNaN(date.getTime())) ? this._fromNativeDate(date) : null;
    }
    /**
     * Converts a NgbDateStruct to a native date
     * @param {?} date
     * @return {?}
     */
    toModel(date) {
        return date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day) ? this._toNativeDate(date) :
            null;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    _fromNativeDate(date) {
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }
    /**
     * @param {?} date
     * @return {?}
     */
    _toNativeDate(date) {
        /** @type {?} */
        const jsDate = new Date(date.year, date.month - 1, date.day, 12);
        // avoid 30 -> 1930 conversion
        jsDate.setFullYear(date.year);
        return jsDate;
    }
}
NgbDateNativeAdapter.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * NgbDateAdapter implementation that allows using native javascript UTC date as a user date model.
 * Same as NgbDateNativeAdapter, but uses UTC dates.
 *
 * \@since 3.2.0
 */
class NgbDateNativeUTCAdapter extends NgbDateNativeAdapter {
    /**
     * @param {?} date
     * @return {?}
     */
    _fromNativeDate(date) {
        return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
    }
    /**
     * @param {?} date
     * @return {?}
     */
    _toNativeDate(date) {
        /** @type {?} */
        const jsDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
        // avoid 30 -> 1930 conversion
        jsDate.setUTCFullYear(date.year);
        return jsDate;
    }
}
NgbDateNativeUTCAdapter.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbDatepickerModule }; }
}
NgbDatepickerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    NgbDatepicker, NgbDatepickerMonthView, NgbDatepickerNavigation, NgbDatepickerNavigationSelect, NgbDatepickerDayView,
                    NgbInputDatepicker
                ],
                exports: [NgbDatepicker, NgbInputDatepicker],
                imports: [CommonModule, FormsModule],
                entryComponents: [NgbDatepicker]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbDropdown directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the dropdowns used in the application.
 */
class NgbDropdownConfig {
    constructor() {
        this.autoClose = true;
        this.placement = 'bottom-left';
    }
}
NgbDropdownConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbDropdownConfig.ngInjectableDef = defineInjectable({ factory: function NgbDropdownConfig_Factory() { return new NgbDropdownConfig(); }, token: NgbDropdownConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 *
 */
class NgbDropdownMenu {
    /**
     * @param {?} dropdown
     * @param {?} _elementRef
     * @param {?} _renderer
     */
    constructor(dropdown, _elementRef, _renderer) {
        this.dropdown = dropdown;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this.placement = 'bottom';
        this.isOpen = false;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    isEventFrom($event) { return this._elementRef.nativeElement.contains($event.target); }
    /**
     * @param {?} triggerEl
     * @param {?} placement
     * @return {?}
     */
    position(triggerEl, placement) {
        this.applyPlacement(positionElements(triggerEl, this._elementRef.nativeElement, placement));
    }
    /**
     * @param {?} _placement
     * @return {?}
     */
    applyPlacement(_placement) {
        // remove the current placement classes
        this._renderer.removeClass(this._elementRef.nativeElement.parentNode, 'dropup');
        this._renderer.removeClass(this._elementRef.nativeElement.parentNode, 'dropdown');
        this.placement = _placement;
        /**
         * apply the new placement
         * in case of top use up-arrow or down-arrow otherwise
         */
        if (_placement.search('^top') !== -1) {
            this._renderer.addClass(this._elementRef.nativeElement.parentNode, 'dropup');
        }
        else {
            this._renderer.addClass(this._elementRef.nativeElement.parentNode, 'dropdown');
        }
    }
}
NgbDropdownMenu.decorators = [
    { type: Directive, args: [{
                selector: '[ngbDropdownMenu]',
                host: { '[class.dropdown-menu]': 'true', '[class.show]': 'dropdown.isOpen()', '[attr.x-placement]': 'placement' }
            },] }
];
/** @nocollapse */
NgbDropdownMenu.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => NgbDropdown),] }] },
    { type: ElementRef },
    { type: Renderer2 }
];
/**
 * Marks an element to which dropdown menu will be anchored. This is a simple version
 * of the NgbDropdownToggle directive. It plays the same role as NgbDropdownToggle but
 * doesn't listen to click events to toggle dropdown menu thus enabling support for
 * events other than click.
 *
 * \@since 1.1.0
 */
class NgbDropdownAnchor {
    /**
     * @param {?} dropdown
     * @param {?} _elementRef
     */
    constructor(dropdown, _elementRef) {
        this.dropdown = dropdown;
        this._elementRef = _elementRef;
        this.anchorEl = _elementRef.nativeElement;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    isEventFrom($event) { return this._elementRef.nativeElement.contains($event.target); }
}
NgbDropdownAnchor.decorators = [
    { type: Directive, args: [{
                selector: '[ngbDropdownAnchor]',
                host: { 'class': 'dropdown-toggle', 'aria-haspopup': 'true', '[attr.aria-expanded]': 'dropdown.isOpen()' }
            },] }
];
/** @nocollapse */
NgbDropdownAnchor.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => NgbDropdown),] }] },
    { type: ElementRef }
];
/**
 * Allows the dropdown to be toggled via click. This directive is optional: you can use NgbDropdownAnchor as an
 * alternative.
 */
class NgbDropdownToggle extends NgbDropdownAnchor {
    /**
     * @param {?} dropdown
     * @param {?} elementRef
     */
    constructor(dropdown, elementRef) {
        super(dropdown, elementRef);
    }
    /**
     * @return {?}
     */
    toggleOpen() { this.dropdown.toggle(); }
}
NgbDropdownToggle.decorators = [
    { type: Directive, args: [{
                selector: '[ngbDropdownToggle]',
                host: {
                    'class': 'dropdown-toggle',
                    'aria-haspopup': 'true',
                    '[attr.aria-expanded]': 'dropdown.isOpen()',
                    '(click)': 'toggleOpen()'
                },
                providers: [{ provide: NgbDropdownAnchor, useExisting: forwardRef(() => NgbDropdownToggle) }]
            },] }
];
/** @nocollapse */
NgbDropdownToggle.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => NgbDropdown),] }] },
    { type: ElementRef }
];
/**
 * Transforms a node into a dropdown.
 */
class NgbDropdown {
    /**
     * @param {?} _changeDetector
     * @param {?} config
     * @param {?} _document
     * @param {?} _ngZone
     */
    constructor(_changeDetector, config, _document, _ngZone) {
        this._changeDetector = _changeDetector;
        this._document = _document;
        this._ngZone = _ngZone;
        this._closed$ = new Subject();
        /**
         *  Defines whether or not the dropdown-menu is open initially.
         */
        this._open = false;
        /**
         *  An event fired when the dropdown is opened or closed.
         *  Event's payload equals whether dropdown is open.
         */
        this.openChange = new EventEmitter();
        this.placement = config.placement;
        this.autoClose = config.autoClose;
        this._zoneSubscription = _ngZone.onStable.subscribe(() => { this._positionMenu(); });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this._menu) {
            this._menu.applyPlacement(Array.isArray(this.placement) ? (this.placement[0]) : (/** @type {?} */ (this.placement)));
        }
        if (this._open) {
            this._setCloseHandlers();
        }
    }
    /**
     * Checks if the dropdown menu is open or not.
     * @return {?}
     */
    isOpen() { return this._open; }
    /**
     * Opens the dropdown menu of a given navbar or tabbed navigation.
     * @return {?}
     */
    open() {
        if (!this._open) {
            this._open = true;
            this._positionMenu();
            this.openChange.emit(true);
            this._setCloseHandlers();
        }
    }
    /**
     * @return {?}
     */
    _setCloseHandlers() {
        if (this.autoClose) {
            this._ngZone.runOutsideAngular(() => {
                /** @type {?} */
                const escapes$ = fromEvent(this._document, 'keyup')
                    .pipe(takeUntil(this._closed$), 
                // tslint:disable-next-line:deprecation
                filter(event => event.which === Key.Escape));
                /** @type {?} */
                const clicks$ = fromEvent(this._document, 'click')
                    .pipe(takeUntil(this._closed$), filter(event => this._shouldCloseFromClick(event)));
                race([escapes$, clicks$]).pipe(takeUntil(this._closed$)).subscribe(() => this._ngZone.run(() => {
                    this.close();
                    this._changeDetector.markForCheck();
                }));
            });
        }
    }
    /**
     * Closes the dropdown menu of a given navbar or tabbed navigation.
     * @return {?}
     */
    close() {
        if (this._open) {
            this._open = false;
            this._closed$.next();
            this.openChange.emit(false);
        }
    }
    /**
     * Toggles the dropdown menu of a given navbar or tabbed navigation.
     * @return {?}
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _shouldCloseFromClick(event) {
        if (event.button !== 2 && !this._isEventFromToggle(event)) {
            if (this.autoClose === true) {
                return true;
            }
            else if (this.autoClose === 'inside' && this._isEventFromMenu(event)) {
                return true;
            }
            else if (this.autoClose === 'outside' && !this._isEventFromMenu(event)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._closed$.next();
        this._zoneSubscription.unsubscribe();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    _isEventFromToggle($event) { return this._anchor.isEventFrom($event); }
    /**
     * @param {?} $event
     * @return {?}
     */
    _isEventFromMenu($event) { return this._menu ? this._menu.isEventFrom($event) : false; }
    /**
     * @return {?}
     */
    _positionMenu() {
        if (this.isOpen() && this._menu) {
            this._menu.position(this._anchor.anchorEl, this.placement);
        }
    }
}
NgbDropdown.decorators = [
    { type: Directive, args: [{ selector: '[ngbDropdown]', exportAs: 'ngbDropdown', host: { '[class.show]': 'isOpen()' } },] }
];
/** @nocollapse */
NgbDropdown.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: NgbDropdownConfig },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: NgZone }
];
NgbDropdown.propDecorators = {
    _menu: [{ type: ContentChild, args: [NgbDropdownMenu,] }],
    _anchor: [{ type: ContentChild, args: [NgbDropdownAnchor,] }],
    autoClose: [{ type: Input }],
    _open: [{ type: Input, args: ['open',] }],
    placement: [{ type: Input }],
    openChange: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_DROPDOWN_DIRECTIVES = [NgbDropdown, NgbDropdownAnchor, NgbDropdownToggle, NgbDropdownMenu];
class NgbDropdownModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbDropdownModule }; }
}
NgbDropdownModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_DROPDOWN_DIRECTIVES, exports: NGB_DROPDOWN_DIRECTIVES },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration object token for the NgbModal service.
 * You can provide this configuration, typically in your root module in order to provide default option values for every
 * modal.
 *
 * \@since 3.1.0
 */
class NgbModalConfig {
    constructor() {
        this.backdrop = true;
        this.keyboard = true;
    }
}
NgbModalConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbModalConfig.ngInjectableDef = defineInjectable({ factory: function NgbModalConfig_Factory() { return new NgbModalConfig(); }, token: NgbModalConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class ContentRef {
    /**
     * @param {?} nodes
     * @param {?=} viewRef
     * @param {?=} componentRef
     */
    constructor(nodes, viewRef, componentRef) {
        this.nodes = nodes;
        this.viewRef = viewRef;
        this.componentRef = componentRef;
    }
}
/**
 * @template T
 */
class PopupService {
    /**
     * @param {?} _type
     * @param {?} _injector
     * @param {?} _viewContainerRef
     * @param {?} _renderer
     * @param {?} _componentFactoryResolver
     */
    constructor(_type, _injector, _viewContainerRef, _renderer, _componentFactoryResolver) {
        this._type = _type;
        this._injector = _injector;
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this._componentFactoryResolver = _componentFactoryResolver;
    }
    /**
     * @param {?=} content
     * @param {?=} context
     * @return {?}
     */
    open(content, context) {
        if (!this._windowRef) {
            this._contentRef = this._getContentRef(content, context);
            this._windowRef = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(this._type), 0, this._injector, this._contentRef.nodes);
        }
        return this._windowRef;
    }
    /**
     * @return {?}
     */
    close() {
        if (this._windowRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView));
            this._windowRef = null;
            if (this._contentRef.viewRef) {
                this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef));
                this._contentRef = null;
            }
        }
    }
    /**
     * @param {?} content
     * @param {?=} context
     * @return {?}
     */
    _getContentRef(content, context) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            /** @type {?} */
            const viewRef = this._viewContainerRef.createEmbeddedView((/** @type {?} */ (content)), context);
            return new ContentRef([viewRef.rootNodes], viewRef);
        }
        else {
            return new ContentRef([[this._renderer.createText(`${content}`)]]);
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const noop = () => { };
/**
 * Utility to handle the scrollbar.
 *
 * It allows to compensate the lack of a vertical scrollbar by adding an
 * equivalent padding on the right of the body, and to remove this compensation.
 */
class ScrollBar {
    /**
     * @param {?} _document
     */
    constructor(_document) {
        this._document = _document;
    }
    /**
     * Detects if a scrollbar is present and if yes, already compensates for its
     * removal by adding an equivalent padding on the right of the body.
     *
     * @return {?} a callback used to revert the compensation (noop if there was none,
     * otherwise a function removing the padding)
     */
    compensate() { return !this._isPresent() ? noop : this._adjustBody(this._getWidth()); }
    /**
     * Adds a padding of the given width on the right of the body.
     *
     * @param {?} width
     * @return {?} a callback used to revert the padding to its previous value
     */
    _adjustBody(width) {
        /** @type {?} */
        const body = this._document.body;
        /** @type {?} */
        const userSetPadding = body.style.paddingRight;
        /** @type {?} */
        const paddingAmount = parseFloat(window.getComputedStyle(body)['padding-right']);
        body.style['padding-right'] = `${paddingAmount + width}px`;
        return () => body.style['padding-right'] = userSetPadding;
    }
    /**
     * Tells whether a scrollbar is currently present on the body.
     *
     * @return {?} true if scrollbar is present, false otherwise
     */
    _isPresent() {
        /** @type {?} */
        const rect = this._document.body.getBoundingClientRect();
        return rect.left + rect.right < window.innerWidth;
    }
    /**
     * Calculates and returns the width of a scrollbar.
     *
     * @return {?} the width of a scrollbar on this page
     */
    _getWidth() {
        /** @type {?} */
        const measurer = this._document.createElement('div');
        measurer.className = 'modal-scrollbar-measure';
        /** @type {?} */
        const body = this._document.body;
        body.appendChild(measurer);
        /** @type {?} */
        const width = measurer.getBoundingClientRect().width - measurer.clientWidth;
        body.removeChild(measurer);
        return width;
    }
}
ScrollBar.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
ScrollBar.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
/** @nocollapse */ ScrollBar.ngInjectableDef = defineInjectable({ factory: function ScrollBar_Factory() { return new ScrollBar(inject(DOCUMENT)); }, token: ScrollBar, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbModalBackdrop {
}
NgbModalBackdrop.decorators = [
    { type: Component, args: [{
                selector: 'ngb-modal-backdrop',
                template: '',
                host: { '[class]': '"modal-backdrop fade show" + (backdropClass ? " " + backdropClass : "")', 'style': 'z-index: 1050' }
            }] }
];
NgbModalBackdrop.propDecorators = {
    backdropClass: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * A reference to an active (currently opened) modal. Instances of this class
 * can be injected into components passed as modal content.
 */
class NgbActiveModal {
    /**
     * Closes the modal with an optional 'result' value.
     * The 'NgbMobalRef.result' promise will be resolved with provided value.
     * @param {?=} result
     * @return {?}
     */
    close(result) { }
    /**
     * Dismisses the modal with an optional 'reason' value.
     * The 'NgbModalRef.result' promise will be rejected with provided value.
     * @param {?=} reason
     * @return {?}
     */
    dismiss(reason) { }
}
/**
 * A reference to a newly opened modal returned by the 'NgbModal.open()' method.
 */
class NgbModalRef {
    /**
     * @param {?} _windowCmptRef
     * @param {?} _contentRef
     * @param {?=} _backdropCmptRef
     * @param {?=} _beforeDismiss
     */
    constructor(_windowCmptRef, _contentRef, _backdropCmptRef, _beforeDismiss) {
        this._windowCmptRef = _windowCmptRef;
        this._contentRef = _contentRef;
        this._backdropCmptRef = _backdropCmptRef;
        this._beforeDismiss = _beforeDismiss;
        _windowCmptRef.instance.dismissEvent.subscribe((reason) => { this.dismiss(reason); });
        this.result = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        this.result.then(null, () => { });
    }
    /**
     * The instance of component used as modal's content.
     * Undefined when a TemplateRef is used as modal's content.
     * @return {?}
     */
    get componentInstance() {
        if (this._contentRef.componentRef) {
            return this._contentRef.componentRef.instance;
        }
    }
    /**
     * Closes the modal with an optional 'result' value.
     * The 'NgbMobalRef.result' promise will be resolved with provided value.
     * @param {?=} result
     * @return {?}
     */
    close(result) {
        if (this._windowCmptRef) {
            this._resolve(result);
            this._removeModalElements();
        }
    }
    /**
     * @param {?=} reason
     * @return {?}
     */
    _dismiss(reason) {
        this._reject(reason);
        this._removeModalElements();
    }
    /**
     * Dismisses the modal with an optional 'reason' value.
     * The 'NgbModalRef.result' promise will be rejected with provided value.
     * @param {?=} reason
     * @return {?}
     */
    dismiss(reason) {
        if (this._windowCmptRef) {
            if (!this._beforeDismiss) {
                this._dismiss(reason);
            }
            else {
                /** @type {?} */
                const dismiss = this._beforeDismiss();
                if (dismiss && dismiss.then) {
                    dismiss.then(result => {
                        if (result !== false) {
                            this._dismiss(reason);
                        }
                    }, () => { });
                }
                else if (dismiss !== false) {
                    this._dismiss(reason);
                }
            }
        }
    }
    /**
     * @return {?}
     */
    _removeModalElements() {
        /** @type {?} */
        const windowNativeEl = this._windowCmptRef.location.nativeElement;
        windowNativeEl.parentNode.removeChild(windowNativeEl);
        this._windowCmptRef.destroy();
        if (this._backdropCmptRef) {
            /** @type {?} */
            const backdropNativeEl = this._backdropCmptRef.location.nativeElement;
            backdropNativeEl.parentNode.removeChild(backdropNativeEl);
            this._backdropCmptRef.destroy();
        }
        if (this._contentRef && this._contentRef.viewRef) {
            this._contentRef.viewRef.destroy();
        }
        this._windowCmptRef = null;
        this._backdropCmptRef = null;
        this._contentRef = null;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
const ModalDismissReasons = {
    BACKDROP_CLICK: 0,
    ESC: 1,
};
ModalDismissReasons[ModalDismissReasons.BACKDROP_CLICK] = 'BACKDROP_CLICK';
ModalDismissReasons[ModalDismissReasons.ESC] = 'ESC';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbModalWindow {
    /**
     * @param {?} _document
     * @param {?} _elRef
     */
    constructor(_document, _elRef) {
        this._document = _document;
        this._elRef = _elRef;
        this.backdrop = true;
        this.keyboard = true;
        this.dismissEvent = new EventEmitter();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    backdropClick($event) {
        if (this.backdrop === true && this._elRef.nativeElement === $event.target) {
            this.dismiss(ModalDismissReasons.BACKDROP_CLICK);
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    escKey($event) {
        if (this.keyboard && !$event.defaultPrevented) {
            this.dismiss(ModalDismissReasons.ESC);
        }
    }
    /**
     * @param {?} reason
     * @return {?}
     */
    dismiss(reason) { this.dismissEvent.emit(reason); }
    /**
     * @return {?}
     */
    ngOnInit() { this._elWithFocus = this._document.activeElement; }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (!this._elRef.nativeElement.contains(document.activeElement)) {
            /** @type {?} */
            const autoFocusable = (/** @type {?} */ (this._elRef.nativeElement.querySelector(`[ngbAutofocus]`)));
            /** @type {?} */
            const firstFocusable = getFocusableBoundaryElements(this._elRef.nativeElement)[0];
            /** @type {?} */
            const elementToFocus = autoFocusable || firstFocusable || this._elRef.nativeElement;
            elementToFocus.focus();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        /** @type {?} */
        const body = this._document.body;
        /** @type {?} */
        const elWithFocus = this._elWithFocus;
        /** @type {?} */
        let elementToFocus;
        if (elWithFocus && elWithFocus['focus'] && body.contains(elWithFocus)) {
            elementToFocus = elWithFocus;
        }
        else {
            elementToFocus = body;
        }
        elementToFocus.focus();
        this._elWithFocus = null;
    }
}
NgbModalWindow.decorators = [
    { type: Component, args: [{
                selector: 'ngb-modal-window',
                host: {
                    '[class]': '"modal fade show d-block" + (windowClass ? " " + windowClass : "")',
                    'role': 'dialog',
                    'tabindex': '-1',
                    '(keyup.esc)': 'escKey($event)',
                    '(click)': 'backdropClick($event)',
                    '[attr.aria-labelledby]': 'ariaLabelledBy',
                },
                template: `
    <div [class]="'modal-dialog' + (size ? ' modal-' + size : '') + (centered ? ' modal-dialog-centered' : '')" role="document">
        <div class="modal-content"><ng-content></ng-content></div>
    </div>
    `
            }] }
];
/** @nocollapse */
NgbModalWindow.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: ElementRef }
];
NgbModalWindow.propDecorators = {
    ariaLabelledBy: [{ type: Input }],
    backdrop: [{ type: Input }],
    centered: [{ type: Input }],
    keyboard: [{ type: Input }],
    size: [{ type: Input }],
    windowClass: [{ type: Input }],
    dismissEvent: [{ type: Output, args: ['dismiss',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbModalStack {
    /**
     * @param {?} _applicationRef
     * @param {?} _injector
     * @param {?} _document
     * @param {?} _scrollBar
     * @param {?} _rendererFactory
     */
    constructor(_applicationRef, _injector, _document, _scrollBar, _rendererFactory) {
        this._applicationRef = _applicationRef;
        this._injector = _injector;
        this._document = _document;
        this._scrollBar = _scrollBar;
        this._rendererFactory = _rendererFactory;
        this._windowAttributes = ['ariaLabelledBy', 'backdrop', 'centered', 'keyboard', 'size', 'windowClass'];
        this._backdropAttributes = ['backdropClass'];
        this._modalRefs = [];
        this._windowCmpts = [];
        this._activeWindowCmptHasChanged = new Subject();
        // Trap focus on active WindowCmpt
        this._activeWindowCmptHasChanged.subscribe(() => {
            if (this._windowCmpts.length) {
                /** @type {?} */
                const activeWindowCmpt = this._windowCmpts[this._windowCmpts.length - 1];
                ngbFocusTrap(activeWindowCmpt.location.nativeElement, this._activeWindowCmptHasChanged);
            }
        });
    }
    /**
     * @param {?} moduleCFR
     * @param {?} contentInjector
     * @param {?} content
     * @param {?} options
     * @return {?}
     */
    open(moduleCFR, contentInjector, content, options) {
        /** @type {?} */
        const containerEl = isDefined(options.container) ? this._document.querySelector(options.container) : this._document.body;
        /** @type {?} */
        const renderer = this._rendererFactory.createRenderer(null, null);
        /** @type {?} */
        const revertPaddingForScrollBar = this._scrollBar.compensate();
        /** @type {?} */
        const removeBodyClass = () => {
            if (!this._modalRefs.length) {
                renderer.removeClass(this._document.body, 'modal-open');
            }
        };
        if (!containerEl) {
            throw new Error(`The specified modal container "${options.container || 'body'}" was not found in the DOM.`);
        }
        /** @type {?} */
        const activeModal = new NgbActiveModal();
        /** @type {?} */
        const contentRef = this._getContentRef(moduleCFR, options.injector || contentInjector, content, activeModal);
        /** @type {?} */
        let backdropCmptRef = options.backdrop !== false ? this._attachBackdrop(moduleCFR, containerEl) : null;
        /** @type {?} */
        let windowCmptRef = this._attachWindowComponent(moduleCFR, containerEl, contentRef);
        /** @type {?} */
        let ngbModalRef = new NgbModalRef(windowCmptRef, contentRef, backdropCmptRef, options.beforeDismiss);
        this._registerModalRef(ngbModalRef);
        this._registerWindowCmpt(windowCmptRef);
        ngbModalRef.result.then(revertPaddingForScrollBar, revertPaddingForScrollBar);
        ngbModalRef.result.then(removeBodyClass, removeBodyClass);
        activeModal.close = (result) => { ngbModalRef.close(result); };
        activeModal.dismiss = (reason) => { ngbModalRef.dismiss(reason); };
        this._applyWindowOptions(windowCmptRef.instance, options);
        if (this._modalRefs.length === 1) {
            renderer.addClass(this._document.body, 'modal-open');
        }
        if (backdropCmptRef && backdropCmptRef.instance) {
            this._applyBackdropOptions(backdropCmptRef.instance, options);
        }
        return ngbModalRef;
    }
    /**
     * @param {?=} reason
     * @return {?}
     */
    dismissAll(reason) { this._modalRefs.forEach(ngbModalRef => ngbModalRef.dismiss(reason)); }
    /**
     * @return {?}
     */
    hasOpenModals() { return this._modalRefs.length > 0; }
    /**
     * @param {?} moduleCFR
     * @param {?} containerEl
     * @return {?}
     */
    _attachBackdrop(moduleCFR, containerEl) {
        /** @type {?} */
        let backdropFactory = moduleCFR.resolveComponentFactory(NgbModalBackdrop);
        /** @type {?} */
        let backdropCmptRef = backdropFactory.create(this._injector);
        this._applicationRef.attachView(backdropCmptRef.hostView);
        containerEl.appendChild(backdropCmptRef.location.nativeElement);
        return backdropCmptRef;
    }
    /**
     * @param {?} moduleCFR
     * @param {?} containerEl
     * @param {?} contentRef
     * @return {?}
     */
    _attachWindowComponent(moduleCFR, containerEl, contentRef) {
        /** @type {?} */
        let windowFactory = moduleCFR.resolveComponentFactory(NgbModalWindow);
        /** @type {?} */
        let windowCmptRef = windowFactory.create(this._injector, contentRef.nodes);
        this._applicationRef.attachView(windowCmptRef.hostView);
        containerEl.appendChild(windowCmptRef.location.nativeElement);
        return windowCmptRef;
    }
    /**
     * @param {?} windowInstance
     * @param {?} options
     * @return {?}
     */
    _applyWindowOptions(windowInstance, options) {
        this._windowAttributes.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                windowInstance[optionName] = options[optionName];
            }
        });
    }
    /**
     * @param {?} backdropInstance
     * @param {?} options
     * @return {?}
     */
    _applyBackdropOptions(backdropInstance, options) {
        this._backdropAttributes.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                backdropInstance[optionName] = options[optionName];
            }
        });
    }
    /**
     * @param {?} moduleCFR
     * @param {?} contentInjector
     * @param {?} content
     * @param {?} activeModal
     * @return {?}
     */
    _getContentRef(moduleCFR, contentInjector, content, activeModal) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            return this._createFromTemplateRef(content, activeModal);
        }
        else if (isString(content)) {
            return this._createFromString(content);
        }
        else {
            return this._createFromComponent(moduleCFR, contentInjector, content, activeModal);
        }
    }
    /**
     * @param {?} content
     * @param {?} activeModal
     * @return {?}
     */
    _createFromTemplateRef(content, activeModal) {
        /** @type {?} */
        const context = {
            $implicit: activeModal,
            /**
             * @param {?} result
             * @return {?}
             */
            close(result) { activeModal.close(result); },
            /**
             * @param {?} reason
             * @return {?}
             */
            dismiss(reason) { activeModal.dismiss(reason); }
        };
        /** @type {?} */
        const viewRef = content.createEmbeddedView(context);
        this._applicationRef.attachView(viewRef);
        return new ContentRef([viewRef.rootNodes], viewRef);
    }
    /**
     * @param {?} content
     * @return {?}
     */
    _createFromString(content) {
        /** @type {?} */
        const component = this._document.createTextNode(`${content}`);
        return new ContentRef([[component]]);
    }
    /**
     * @param {?} moduleCFR
     * @param {?} contentInjector
     * @param {?} content
     * @param {?} context
     * @return {?}
     */
    _createFromComponent(moduleCFR, contentInjector, content, context) {
        /** @type {?} */
        const contentCmptFactory = moduleCFR.resolveComponentFactory(content);
        /** @type {?} */
        const modalContentInjector = Injector.create({ providers: [{ provide: NgbActiveModal, useValue: context }], parent: contentInjector });
        /** @type {?} */
        const componentRef = contentCmptFactory.create(modalContentInjector);
        this._applicationRef.attachView(componentRef.hostView);
        return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
    }
    /**
     * @param {?} ngbModalRef
     * @return {?}
     */
    _registerModalRef(ngbModalRef) {
        /** @type {?} */
        const unregisterModalRef = () => {
            /** @type {?} */
            const index = this._modalRefs.indexOf(ngbModalRef);
            if (index > -1) {
                this._modalRefs.splice(index, 1);
            }
        };
        this._modalRefs.push(ngbModalRef);
        ngbModalRef.result.then(unregisterModalRef, unregisterModalRef);
    }
    /**
     * @param {?} ngbWindowCmpt
     * @return {?}
     */
    _registerWindowCmpt(ngbWindowCmpt) {
        this._windowCmpts.push(ngbWindowCmpt);
        this._activeWindowCmptHasChanged.next();
        ngbWindowCmpt.onDestroy(() => {
            /** @type {?} */
            const index = this._windowCmpts.indexOf(ngbWindowCmpt);
            if (index > -1) {
                this._windowCmpts.splice(index, 1);
                this._activeWindowCmptHasChanged.next();
            }
        });
    }
}
NgbModalStack.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
NgbModalStack.ctorParameters = () => [
    { type: ApplicationRef },
    { type: Injector },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: ScrollBar },
    { type: RendererFactory2 }
];
/** @nocollapse */ NgbModalStack.ngInjectableDef = defineInjectable({ factory: function NgbModalStack_Factory() { return new NgbModalStack(inject(ApplicationRef), inject(INJECTOR), inject(DOCUMENT), inject(ScrollBar), inject(RendererFactory2)); }, token: NgbModalStack, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * A service to open modal windows. Creating a modal is straightforward: create a template and pass it as an argument to
 * the "open" method!
 */
class NgbModal {
    /**
     * @param {?} _moduleCFR
     * @param {?} _injector
     * @param {?} _modalStack
     * @param {?} _config
     */
    constructor(_moduleCFR, _injector, _modalStack, _config) {
        this._moduleCFR = _moduleCFR;
        this._injector = _injector;
        this._modalStack = _modalStack;
        this._config = _config;
    }
    /**
     * Opens a new modal window with the specified content and using supplied options. Content can be provided
     * as a TemplateRef or a component type. If you pass a component type as content than instances of those
     * components can be injected with an instance of the NgbActiveModal class. You can use methods on the
     * NgbActiveModal class to close / dismiss modals from "inside" of a component.
     * @param {?} content
     * @param {?=} options
     * @return {?}
     */
    open(content, options = {}) {
        /** @type {?} */
        const combinedOptions = Object.assign({}, this._config, options);
        return this._modalStack.open(this._moduleCFR, this._injector, content, combinedOptions);
    }
    /**
     * Dismiss all currently displayed modal windows with the supplied reason.
     *
     * \@since 3.1.0
     * @param {?=} reason
     * @return {?}
     */
    dismissAll(reason) { this._modalStack.dismissAll(reason); }
    /**
     * Indicates if there are currently any open modal windows in the application.
     *
     * \@since 3.3.0
     * @return {?}
     */
    hasOpenModals() { return this._modalStack.hasOpenModals(); }
}
NgbModal.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
NgbModal.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: Injector },
    { type: NgbModalStack },
    { type: NgbModalConfig }
];
/** @nocollapse */ NgbModal.ngInjectableDef = defineInjectable({ factory: function NgbModal_Factory() { return new NgbModal(inject(ComponentFactoryResolver), inject(INJECTOR), inject(NgbModalStack), inject(NgbModalConfig)); }, token: NgbModal, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbModalModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbModalModule }; }
}
NgbModalModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgbModalBackdrop, NgbModalWindow],
                entryComponents: [NgbModalBackdrop, NgbModalWindow],
                providers: [NgbModal]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbPagination component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the paginations used in the application.
 */
class NgbPaginationConfig {
    constructor() {
        this.disabled = false;
        this.boundaryLinks = false;
        this.directionLinks = true;
        this.ellipses = true;
        this.maxSize = 0;
        this.pageSize = 10;
        this.rotate = false;
    }
}
NgbPaginationConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbPaginationConfig.ngInjectableDef = defineInjectable({ factory: function NgbPaginationConfig_Factory() { return new NgbPaginationConfig(); }, token: NgbPaginationConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * A directive that will take care of visualising a pagination bar and enable / disable buttons correctly!
 */
class NgbPagination {
    /**
     * @param {?} config
     */
    constructor(config) {
        this.pageCount = 0;
        this.pages = [];
        /**
         *  Current page. Page numbers start with 1
         */
        this.page = 1;
        /**
         *  An event fired when the page is changed.
         *  Event's payload equals to the newly selected page.
         *  Will fire only if collection size is set and all values are valid.
         *  Page numbers start with 1
         */
        this.pageChange = new EventEmitter(true);
        this.disabled = config.disabled;
        this.boundaryLinks = config.boundaryLinks;
        this.directionLinks = config.directionLinks;
        this.ellipses = config.ellipses;
        this.maxSize = config.maxSize;
        this.pageSize = config.pageSize;
        this.rotate = config.rotate;
        this.size = config.size;
    }
    /**
     * @return {?}
     */
    hasPrevious() { return this.page > 1; }
    /**
     * @return {?}
     */
    hasNext() { return this.page < this.pageCount; }
    /**
     * @param {?} pageNumber
     * @return {?}
     */
    selectPage(pageNumber) { this._updatePages(pageNumber); }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) { this._updatePages(this.page); }
    /**
     * @param {?} pageNumber
     * @return {?}
     */
    isEllipsis(pageNumber) { return pageNumber === -1; }
    /**
     * Appends ellipses and first/last page number to the displayed pages
     * @param {?} start
     * @param {?} end
     * @return {?}
     */
    _applyEllipses(start, end) {
        if (this.ellipses) {
            if (start > 0) {
                if (start > 1) {
                    this.pages.unshift(-1);
                }
                this.pages.unshift(1);
            }
            if (end < this.pageCount) {
                if (end < (this.pageCount - 1)) {
                    this.pages.push(-1);
                }
                this.pages.push(this.pageCount);
            }
        }
    }
    /**
     * Rotates page numbers based on maxSize items visible.
     * Currently selected page stays in the middle:
     *
     * Ex. for selected page = 6:
     * [5,*6*,7] for maxSize = 3
     * [4,5,*6*,7] for maxSize = 4
     * @return {?}
     */
    _applyRotation() {
        /** @type {?} */
        let start = 0;
        /** @type {?} */
        let end = this.pageCount;
        /** @type {?} */
        let leftOffset = Math.floor(this.maxSize / 2);
        /** @type {?} */
        let rightOffset = this.maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;
        if (this.page <= leftOffset) {
            // very beginning, no rotation -> [0..maxSize]
            end = this.maxSize;
        }
        else if (this.pageCount - this.page < leftOffset) {
            // very end, no rotation -> [len-maxSize..len]
            start = this.pageCount - this.maxSize;
        }
        else {
            // rotate
            start = this.page - leftOffset - 1;
            end = this.page + rightOffset;
        }
        return [start, end];
    }
    /**
     * Paginates page numbers based on maxSize items per page
     * @return {?}
     */
    _applyPagination() {
        /** @type {?} */
        let page = Math.ceil(this.page / this.maxSize) - 1;
        /** @type {?} */
        let start = page * this.maxSize;
        /** @type {?} */
        let end = start + this.maxSize;
        return [start, end];
    }
    /**
     * @param {?} newPageNo
     * @return {?}
     */
    _setPageInRange(newPageNo) {
        /** @type {?} */
        const prevPageNo = this.page;
        this.page = getValueInRange(newPageNo, this.pageCount, 1);
        if (this.page !== prevPageNo && isNumber(this.collectionSize)) {
            this.pageChange.emit(this.page);
        }
    }
    /**
     * @param {?} newPage
     * @return {?}
     */
    _updatePages(newPage) {
        this.pageCount = Math.ceil(this.collectionSize / this.pageSize);
        if (!isNumber(this.pageCount)) {
            this.pageCount = 0;
        }
        // fill-in model needed to render pages
        this.pages.length = 0;
        for (let i = 1; i <= this.pageCount; i++) {
            this.pages.push(i);
        }
        // set page within 1..max range
        this._setPageInRange(newPage);
        // apply maxSize if necessary
        if (this.maxSize > 0 && this.pageCount > this.maxSize) {
            /** @type {?} */
            let start = 0;
            /** @type {?} */
            let end = this.pageCount;
            // either paginating or rotating page numbers
            if (this.rotate) {
                [start, end] = this._applyRotation();
            }
            else {
                [start, end] = this._applyPagination();
            }
            this.pages = this.pages.slice(start, end);
            // adding ellipses
            this._applyEllipses(start, end);
        }
    }
}
NgbPagination.decorators = [
    { type: Component, args: [{
                selector: 'ngb-pagination',
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { 'role': 'navigation' },
                template: `
    <ul [class]="'pagination' + (size ? ' pagination-' + size : '')">
      <li *ngIf="boundaryLinks" class="page-item"
        [class.disabled]="!hasPrevious() || disabled">
        <a aria-label="First" i18n-aria-label="@@ngb.pagination.first-aria" class="page-link" href
          (click)="selectPage(1); $event.preventDefault()" [attr.tabindex]="(hasPrevious() ? null : '-1')">
          <span aria-hidden="true" i18n="@@ngb.pagination.first">&laquo;&laquo;</span>
        </a>
      </li>

      <li *ngIf="directionLinks" class="page-item"
        [class.disabled]="!hasPrevious() || disabled">
        <a aria-label="Previous" i18n-aria-label="@@ngb.pagination.previous-aria" class="page-link" href
          (click)="selectPage(page-1); $event.preventDefault()" [attr.tabindex]="(hasPrevious() ? null : '-1')">
          <span aria-hidden="true" i18n="@@ngb.pagination.previous">&laquo;</span>
        </a>
      </li>
      <li *ngFor="let pageNumber of pages" class="page-item" [class.active]="pageNumber === page"
        [class.disabled]="isEllipsis(pageNumber) || disabled">
        <a *ngIf="isEllipsis(pageNumber)" class="page-link">...</a>
        <a *ngIf="!isEllipsis(pageNumber)" class="page-link" href (click)="selectPage(pageNumber); $event.preventDefault()">
          {{pageNumber}}
          <span *ngIf="pageNumber === page" class="sr-only">(current)</span>
        </a>
      </li>
      <li *ngIf="directionLinks" class="page-item" [class.disabled]="!hasNext() || disabled">
        <a aria-label="Next" i18n-aria-label="@@ngb.pagination.next-aria" class="page-link" href
          (click)="selectPage(page+1); $event.preventDefault()" [attr.tabindex]="(hasNext() ? null : '-1')">
          <span aria-hidden="true" i18n="@@ngb.pagination.next">&raquo;</span>
        </a>
      </li>

      <li *ngIf="boundaryLinks" class="page-item" [class.disabled]="!hasNext() || disabled">
        <a aria-label="Last" i18n-aria-label="@@ngb.pagination.last-aria" class="page-link" href
          (click)="selectPage(pageCount); $event.preventDefault()" [attr.tabindex]="(hasNext() ? null : '-1')">
          <span aria-hidden="true" i18n="@@ngb.pagination.last">&raquo;&raquo;</span>
        </a>
      </li>
    </ul>
  `
            }] }
];
/** @nocollapse */
NgbPagination.ctorParameters = () => [
    { type: NgbPaginationConfig }
];
NgbPagination.propDecorators = {
    disabled: [{ type: Input }],
    boundaryLinks: [{ type: Input }],
    directionLinks: [{ type: Input }],
    ellipses: [{ type: Input }],
    rotate: [{ type: Input }],
    collectionSize: [{ type: Input }],
    maxSize: [{ type: Input }],
    page: [{ type: Input }],
    pageSize: [{ type: Input }],
    pageChange: [{ type: Output }],
    size: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbPaginationModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbPaginationModule }; }
}
NgbPaginationModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbPagination], exports: [NgbPagination], imports: [CommonModule] },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Trigger {
    /**
     * @param {?} open
     * @param {?=} close
     */
    constructor(open, close) {
        this.open = open;
        this.close = close;
        if (!close) {
            this.close = open;
        }
    }
    /**
     * @return {?}
     */
    isManual() { return this.open === 'manual' || this.close === 'manual'; }
}
/** @type {?} */
const DEFAULT_ALIASES = {
    'hover': ['mouseenter', 'mouseleave']
};
/**
 * @param {?} triggers
 * @param {?=} aliases
 * @return {?}
 */
function parseTriggers(triggers, aliases = DEFAULT_ALIASES) {
    /** @type {?} */
    const trimmedTriggers = (triggers || '').trim();
    if (trimmedTriggers.length === 0) {
        return [];
    }
    /** @type {?} */
    const parsedTriggers = trimmedTriggers.split(/\s+/).map(trigger => trigger.split(':')).map((triggerPair) => {
        /** @type {?} */
        let alias = aliases[triggerPair[0]] || triggerPair;
        return new Trigger(alias[0], alias[1]);
    });
    /** @type {?} */
    const manualTriggers = parsedTriggers.filter(triggerPair => triggerPair.isManual());
    if (manualTriggers.length > 1) {
        throw 'Triggers parse error: only one manual trigger is allowed';
    }
    if (manualTriggers.length === 1 && parsedTriggers.length > 1) {
        throw 'Triggers parse error: manual trigger can\'t be mixed with other triggers';
    }
    return parsedTriggers;
}
/** @type {?} */
const noopFn = () => { };
/**
 * @param {?} renderer
 * @param {?} nativeElement
 * @param {?} triggers
 * @param {?} openFn
 * @param {?} closeFn
 * @param {?} toggleFn
 * @return {?}
 */
function listenToTriggers(renderer, nativeElement, triggers, openFn, closeFn, toggleFn) {
    /** @type {?} */
    const parsedTriggers = parseTriggers(triggers);
    /** @type {?} */
    const listeners = [];
    if (parsedTriggers.length === 1 && parsedTriggers[0].isManual()) {
        return noopFn;
    }
    parsedTriggers.forEach((trigger) => {
        if (trigger.open === trigger.close) {
            listeners.push(renderer.listen(nativeElement, trigger.open, toggleFn));
        }
        else {
            listeners.push(renderer.listen(nativeElement, trigger.open, openFn), renderer.listen(nativeElement, trigger.close, closeFn));
        }
    });
    return () => { listeners.forEach(unsubscribeFn => unsubscribeFn()); };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbPopover directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the popovers used in the application.
 */
class NgbPopoverConfig {
    constructor() {
        this.autoClose = true;
        this.placement = 'top';
        this.triggers = 'click';
        this.disablePopover = false;
    }
}
NgbPopoverConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbPopoverConfig.ngInjectableDef = defineInjectable({ factory: function NgbPopoverConfig_Factory() { return new NgbPopoverConfig(); }, token: NgbPopoverConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
let nextId$3 = 0;
class NgbPopoverWindow {
    /**
     * @param {?} _element
     * @param {?} _renderer
     */
    constructor(_element, _renderer) {
        this._element = _element;
        this._renderer = _renderer;
        this.placement = 'top';
    }
    /**
     * @return {?}
     */
    isTitleTemplate() { return this.title instanceof TemplateRef; }
    /**
     * @param {?} _placement
     * @return {?}
     */
    applyPlacement(_placement) {
        // remove the current placement classes
        this._renderer.removeClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString().split('-')[0]);
        this._renderer.removeClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString());
        // set the new placement classes
        this.placement = _placement;
        // apply the new placement
        this._renderer.addClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString().split('-')[0]);
        this._renderer.addClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString());
    }
    /**
     * Tells whether the event has been triggered from this component's subtree or not.
     *
     * @param {?} event the event to check
     *
     * @return {?} whether the event has been triggered from this component's subtree or not.
     */
    isEventFrom(event) { return this._element.nativeElement.contains((/** @type {?} */ (event.target))); }
}
NgbPopoverWindow.decorators = [
    { type: Component, args: [{
                selector: 'ngb-popover-window',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class]': '"popover bs-popover-" + placement.split("-")[0]+" bs-popover-" + placement + (popoverClass ? " " + popoverClass : "")',
                    'role': 'tooltip',
                    '[id]': 'id'
                },
                template: `
    <div class="arrow"></div>
    <h3 class="popover-header" *ngIf="title != null">
      <ng-template #simpleTitle>{{title}}</ng-template>
      <ng-template [ngTemplateOutlet]="isTitleTemplate() ? title : simpleTitle" [ngTemplateOutletContext]="context"></ng-template>
    </h3>
    <div class="popover-body"><ng-content></ng-content></div>`,
                styles: ["ngb-popover-window.bs-popover-bottom .arrow,ngb-popover-window.bs-popover-top .arrow{left:50%;margin-left:-5px}ngb-popover-window.bs-popover-bottom-left .arrow,ngb-popover-window.bs-popover-top-left .arrow{left:2em}ngb-popover-window.bs-popover-bottom-right .arrow,ngb-popover-window.bs-popover-top-right .arrow{left:auto;right:2em}ngb-popover-window.bs-popover-left .arrow,ngb-popover-window.bs-popover-right .arrow{top:50%;margin-top:-5px}ngb-popover-window.bs-popover-left-top .arrow,ngb-popover-window.bs-popover-right-top .arrow{top:.7em}ngb-popover-window.bs-popover-left-bottom .arrow,ngb-popover-window.bs-popover-right-bottom .arrow{top:auto;bottom:.7em}"]
            }] }
];
/** @nocollapse */
NgbPopoverWindow.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
NgbPopoverWindow.propDecorators = {
    placement: [{ type: Input }],
    title: [{ type: Input }],
    id: [{ type: Input }],
    popoverClass: [{ type: Input }],
    context: [{ type: Input }]
};
/**
 * A lightweight, extensible directive for fancy popover creation.
 */
class NgbPopover {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} injector
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     * @param {?} config
     * @param {?} _ngZone
     * @param {?} _document
     */
    constructor(_elementRef, _renderer, injector, componentFactoryResolver, viewContainerRef, config, _ngZone, _document) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._document = _document;
        /**
         * Emits an event when the popover is shown
         */
        this.shown = new EventEmitter();
        /**
         * Emits an event when the popover is hidden
         */
        this.hidden = new EventEmitter();
        this._ngbPopoverWindowId = `ngb-popover-${nextId$3++}`;
        this.autoClose = config.autoClose;
        this.placement = config.placement;
        this.triggers = config.triggers;
        this.container = config.container;
        this.disablePopover = config.disablePopover;
        this.popoverClass = config.popoverClass;
        this._popupService = new PopupService(NgbPopoverWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);
        this._zoneSubscription = _ngZone.onStable.subscribe(() => {
            if (this._windowRef) {
                this._windowRef.instance.applyPlacement(positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body'));
            }
        });
    }
    /**
     * @return {?}
     */
    _isDisabled() {
        if (this.disablePopover) {
            return true;
        }
        if (!this.ngbPopover && !this.popoverTitle) {
            return true;
        }
        return false;
    }
    /**
     * Opens an element’s popover. This is considered a “manual” triggering of the popover.
     * The context is an optional value to be injected into the popover template when it is created.
     * @param {?=} context
     * @return {?}
     */
    open(context) {
        if (!this._windowRef && !this._isDisabled()) {
            this._windowRef = this._popupService.open(this.ngbPopover, context);
            this._windowRef.instance.title = this.popoverTitle;
            this._windowRef.instance.context = context;
            this._windowRef.instance.popoverClass = this.popoverClass;
            this._windowRef.instance.id = this._ngbPopoverWindowId;
            this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbPopoverWindowId);
            if (this.container === 'body') {
                this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            // apply styling to set basic css-classes on target element, before going for positioning
            this._windowRef.changeDetectorRef.detectChanges();
            this._windowRef.changeDetectorRef.markForCheck();
            // position popover along the element
            this._windowRef.instance.applyPlacement(positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body'));
            if (this.autoClose) {
                this._ngZone.runOutsideAngular(() => {
                    // prevents automatic closing right after an opening by putting a guard for the time of one event handling
                    // pass
                    // use case: click event would reach an element opening the popover first, then reach the autoClose handler
                    // which would close it
                    /** @type {?} */
                    let justOpened = true;
                    requestAnimationFrame(() => justOpened = false);
                    /** @type {?} */
                    const escapes$ = fromEvent(this._document, 'keyup')
                        .pipe(takeUntil(this.hidden), 
                    // tslint:disable-next-line:deprecation
                    filter(event => event.which === Key.Escape));
                    /** @type {?} */
                    const clicks$ = fromEvent(this._document, 'click')
                        .pipe(takeUntil(this.hidden), filter(() => !justOpened), filter(event => this._shouldCloseFromClick(event)));
                    race([escapes$, clicks$]).subscribe(() => this._ngZone.run(() => this.close()));
                });
            }
            this.shown.emit();
        }
    }
    /**
     * Closes an element’s popover. This is considered a “manual” triggering of the popover.
     * @return {?}
     */
    close() {
        if (this._windowRef) {
            this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
            this._popupService.close();
            this._windowRef = null;
            this.hidden.emit();
        }
    }
    /**
     * Toggles an element’s popover. This is considered a “manual” triggering of the popover.
     * @return {?}
     */
    toggle() {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Returns whether or not the popover is currently being shown
     * @return {?}
     */
    isOpen() { return this._windowRef != null; }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._unregisterListenersFn = listenToTriggers(this._renderer, this._elementRef.nativeElement, this.triggers, this.open.bind(this), this.close.bind(this), this.toggle.bind(this));
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        // close popover if title and content become empty, or disablePopover set to true
        if ((changes['ngbPopover'] || changes['popoverTitle'] || changes['disablePopover']) && this._isDisabled()) {
            this.close();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.close();
        // This check is needed as it might happen that ngOnDestroy is called before ngOnInit
        // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
        if (this._unregisterListenersFn) {
            this._unregisterListenersFn();
        }
        this._zoneSubscription.unsubscribe();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _shouldCloseFromClick(event) {
        if (event.button !== 2) {
            if (this.autoClose === true) {
                return true;
            }
            else if (this.autoClose === 'inside' && this._isEventFromPopover(event)) {
                return true;
            }
            else if (this.autoClose === 'outside' && !this._isEventFromPopover(event)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _isEventFromPopover(event) {
        /** @type {?} */
        const popup = this._windowRef.instance;
        return popup ? popup.isEventFrom(event) : false;
    }
}
NgbPopover.decorators = [
    { type: Directive, args: [{ selector: '[ngbPopover]', exportAs: 'ngbPopover' },] }
];
/** @nocollapse */
NgbPopover.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: Injector },
    { type: ComponentFactoryResolver },
    { type: ViewContainerRef },
    { type: NgbPopoverConfig },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
NgbPopover.propDecorators = {
    autoClose: [{ type: Input }],
    ngbPopover: [{ type: Input }],
    popoverTitle: [{ type: Input }],
    placement: [{ type: Input }],
    triggers: [{ type: Input }],
    container: [{ type: Input }],
    disablePopover: [{ type: Input }],
    popoverClass: [{ type: Input }],
    shown: [{ type: Output }],
    hidden: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbPopoverModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbPopoverModule }; }
}
NgbPopoverModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgbPopover, NgbPopoverWindow],
                exports: [NgbPopover],
                imports: [CommonModule],
                entryComponents: [NgbPopoverWindow]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbProgressbar component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the progress bars used in the application.
 */
class NgbProgressbarConfig {
    constructor() {
        this.max = 100;
        this.animated = false;
        this.striped = false;
        this.showValue = false;
    }
}
NgbProgressbarConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbProgressbarConfig.ngInjectableDef = defineInjectable({ factory: function NgbProgressbarConfig_Factory() { return new NgbProgressbarConfig(); }, token: NgbProgressbarConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Directive that can be used to provide feedback on the progress of a workflow or an action.
 */
class NgbProgressbar {
    /**
     * @param {?} config
     */
    constructor(config) {
        /**
         * Current value to be displayed in the progressbar. Should be smaller or equal to "max" value.
         */
        this.value = 0;
        this.max = config.max;
        this.animated = config.animated;
        this.striped = config.striped;
        this.type = config.type;
        this.showValue = config.showValue;
        this.height = config.height;
    }
    /**
     * @return {?}
     */
    getValue() { return getValueInRange(this.value, this.max); }
    /**
     * @return {?}
     */
    getPercentValue() { return 100 * this.getValue() / this.max; }
}
NgbProgressbar.decorators = [
    { type: Component, args: [{
                selector: 'ngb-progressbar',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `
    <div class="progress" [style.height]="height">
      <div class="progress-bar{{type ? ' bg-' + type : ''}}{{animated ? ' progress-bar-animated' : ''}}{{striped ?
    ' progress-bar-striped' : ''}}" role="progressbar" [style.width.%]="getPercentValue()"
    [attr.aria-valuenow]="getValue()" aria-valuemin="0" [attr.aria-valuemax]="max">
        <span *ngIf="showValue" i18n="@@ngb.progressbar.value">{{getPercentValue()}}%</span><ng-content></ng-content>
      </div>
    </div>
  `
            }] }
];
/** @nocollapse */
NgbProgressbar.ctorParameters = () => [
    { type: NgbProgressbarConfig }
];
NgbProgressbar.propDecorators = {
    max: [{ type: Input }],
    animated: [{ type: Input }],
    striped: [{ type: Input }],
    showValue: [{ type: Input }],
    type: [{ type: Input }],
    value: [{ type: Input }],
    height: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbProgressbarModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbProgressbarModule }; }
}
NgbProgressbarModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbProgressbar], exports: [NgbProgressbar], imports: [CommonModule] },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbRating component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the ratings used in the application.
 */
class NgbRatingConfig {
    constructor() {
        this.max = 10;
        this.readonly = false;
        this.resettable = false;
    }
}
NgbRatingConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbRatingConfig.ngInjectableDef = defineInjectable({ factory: function NgbRatingConfig_Factory() { return new NgbRatingConfig(); }, token: NgbRatingConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_RATING_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbRating),
    multi: true
};
/**
 * Rating directive that will take care of visualising a star rating bar.
 */
class NgbRating {
    /**
     * @param {?} config
     * @param {?} _changeDetectorRef
     */
    constructor(config, _changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        this.contexts = [];
        this.disabled = false;
        /**
         * An event fired when a user is hovering over a given rating.
         * Event's payload equals to the rating being hovered over.
         */
        this.hover = new EventEmitter();
        /**
         * An event fired when a user stops hovering over a given rating.
         * Event's payload equals to the rating of the last item being hovered over.
         */
        this.leave = new EventEmitter();
        /**
         * An event fired when a user selects a new rating.
         * Event's payload equals to the newly selected rating.
         */
        this.rateChange = new EventEmitter(true);
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this.max = config.max;
        this.readonly = config.readonly;
    }
    /**
     * @return {?}
     */
    ariaValueText() { return `${this.nextRate} out of ${this.max}`; }
    /**
     * @param {?} value
     * @return {?}
     */
    enter(value) {
        if (!this.readonly && !this.disabled) {
            this._updateState(value);
        }
        this.hover.emit(value);
    }
    /**
     * @return {?}
     */
    handleBlur() { this.onTouched(); }
    /**
     * @param {?} value
     * @return {?}
     */
    handleClick(value) { this.update(this.resettable && this.rate === value ? 0 : value); }
    /**
     * @param {?} event
     * @return {?}
     */
    handleKeyDown(event) {
        // tslint:disable-next-line:deprecation
        const { which } = event;
        if (Key[toString(which)]) {
            event.preventDefault();
            switch (which) {
                case Key.ArrowDown:
                case Key.ArrowLeft:
                    this.update(this.rate - 1);
                    break;
                case Key.ArrowUp:
                case Key.ArrowRight:
                    this.update(this.rate + 1);
                    break;
                case Key.Home:
                    this.update(0);
                    break;
                case Key.End:
                    this.update(this.max);
                    break;
            }
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['rate']) {
            this.update(this.rate);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.contexts = Array.from({ length: this.max }, (v, k) => ({ fill: 0, index: k }));
        this._updateState(this.rate);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @return {?}
     */
    reset() {
        this.leave.emit(this.nextRate);
        this._updateState(this.rate);
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    /**
     * @param {?} value
     * @param {?=} internalChange
     * @return {?}
     */
    update(value, internalChange = true) {
        /** @type {?} */
        const newRate = getValueInRange(value, this.max, 0);
        if (!this.readonly && !this.disabled && this.rate !== newRate) {
            this.rate = newRate;
            this.rateChange.emit(this.rate);
        }
        if (internalChange) {
            this.onChange(this.rate);
            this.onTouched();
        }
        this._updateState(this.rate);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.update(value, false);
        this._changeDetectorRef.markForCheck();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    _getFillValue(index) {
        /** @type {?} */
        const diff = this.nextRate - index;
        if (diff >= 1) {
            return 100;
        }
        if (diff < 1 && diff > 0) {
            return parseInt((diff * 100).toFixed(2), 10);
        }
        return 0;
    }
    /**
     * @param {?} nextValue
     * @return {?}
     */
    _updateState(nextValue) {
        this.nextRate = nextValue;
        this.contexts.forEach((context, index) => context.fill = this._getFillValue(index));
    }
}
NgbRating.decorators = [
    { type: Component, args: [{
                selector: 'ngb-rating',
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'd-inline-flex',
                    'tabindex': '0',
                    'role': 'slider',
                    'aria-valuemin': '0',
                    '[attr.aria-valuemax]': 'max',
                    '[attr.aria-valuenow]': 'nextRate',
                    '[attr.aria-valuetext]': 'ariaValueText()',
                    '[attr.aria-disabled]': 'readonly ? true : null',
                    '(blur)': 'handleBlur()',
                    '(keydown)': 'handleKeyDown($event)',
                    '(mouseleave)': 'reset()'
                },
                template: `
    <ng-template #t let-fill="fill">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</ng-template>
    <ng-template ngFor [ngForOf]="contexts" let-index="index">
      <span class="sr-only">({{ index < nextRate ? '*' : ' ' }})</span>
      <span (mouseenter)="enter(index + 1)" (click)="handleClick(index + 1)" [style.cursor]="readonly || disabled ? 'default' : 'pointer'">
        <ng-template [ngTemplateOutlet]="starTemplate || t" [ngTemplateOutletContext]="contexts[index]"></ng-template>
      </span>
    </ng-template>
  `,
                providers: [NGB_RATING_VALUE_ACCESSOR]
            }] }
];
/** @nocollapse */
NgbRating.ctorParameters = () => [
    { type: NgbRatingConfig },
    { type: ChangeDetectorRef }
];
NgbRating.propDecorators = {
    max: [{ type: Input }],
    rate: [{ type: Input }],
    readonly: [{ type: Input }],
    resettable: [{ type: Input }],
    starTemplate: [{ type: Input }, { type: ContentChild, args: [TemplateRef,] }],
    hover: [{ type: Output }],
    leave: [{ type: Output }],
    rateChange: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbRatingModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbRatingModule }; }
}
NgbRatingModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbRating], exports: [NgbRating], imports: [CommonModule] },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbTabset component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tabsets used in the application.
 */
class NgbTabsetConfig {
    constructor() {
        this.justify = 'start';
        this.orientation = 'horizontal';
        this.type = 'tabs';
    }
}
NgbTabsetConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbTabsetConfig.ngInjectableDef = defineInjectable({ factory: function NgbTabsetConfig_Factory() { return new NgbTabsetConfig(); }, token: NgbTabsetConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
let nextId$4 = 0;
/**
 * This directive should be used to wrap tab titles that need to contain HTML markup or other directives.
 */
class NgbTabTitle {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbTabTitle.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbTabTitle]' },] }
];
/** @nocollapse */
NgbTabTitle.ctorParameters = () => [
    { type: TemplateRef }
];
/**
 * This directive must be used to wrap content to be displayed in a tab.
 */
class NgbTabContent {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbTabContent.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbTabContent]' },] }
];
/** @nocollapse */
NgbTabContent.ctorParameters = () => [
    { type: TemplateRef }
];
/**
 * A directive representing an individual tab.
 */
class NgbTab {
    constructor() {
        /**
         * Unique tab identifier. Must be unique for the entire document for proper accessibility support.
         */
        this.id = `ngb-tab-${nextId$4++}`;
        /**
         * Allows toggling disabled state of a given state. Disabled tabs can't be selected.
         */
        this.disabled = false;
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        // We are using @ContentChildren instead of @ContentChild as in the Angular version being used
        // only @ContentChildren allows us to specify the {descendants: false} option.
        // Without {descendants: false} we are hitting bugs described in:
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
        this.titleTpl = this.titleTpls.first;
        this.contentTpl = this.contentTpls.first;
    }
}
NgbTab.decorators = [
    { type: Directive, args: [{ selector: 'ngb-tab' },] }
];
NgbTab.propDecorators = {
    id: [{ type: Input }],
    title: [{ type: Input }],
    disabled: [{ type: Input }],
    titleTpls: [{ type: ContentChildren, args: [NgbTabTitle, { descendants: false },] }],
    contentTpls: [{ type: ContentChildren, args: [NgbTabContent, { descendants: false },] }]
};
/**
 * A component that makes it easy to create tabbed interface.
 */
class NgbTabset {
    /**
     * @param {?} config
     */
    constructor(config) {
        /**
         * Whether the closed tabs should be hidden without destroying them
         */
        this.destroyOnHide = true;
        /**
         * A tab change event fired right before the tab selection happens. See NgbTabChangeEvent for payload details
         */
        this.tabChange = new EventEmitter();
        this.type = config.type;
        this.justify = config.justify;
        this.orientation = config.orientation;
    }
    /**
     * The horizontal alignment of the nav with flexbox utilities. Can be one of 'start', 'center', 'end', 'fill' or
     * 'justified'
     * The default value is 'start'.
     * @param {?} className
     * @return {?}
     */
    set justify(className) {
        if (className === 'fill' || className === 'justified') {
            this.justifyClass = `nav-${className}`;
        }
        else {
            this.justifyClass = `justify-content-${className}`;
        }
    }
    /**
     * Selects the tab with the given id and shows its associated pane.
     * Any other tab that was previously selected becomes unselected and its associated pane is hidden.
     * @param {?} tabId
     * @return {?}
     */
    select(tabId) {
        /** @type {?} */
        let selectedTab = this._getTabById(tabId);
        if (selectedTab && !selectedTab.disabled && this.activeId !== selectedTab.id) {
            /** @type {?} */
            let defaultPrevented = false;
            this.tabChange.emit({ activeId: this.activeId, nextId: selectedTab.id, preventDefault: () => { defaultPrevented = true; } });
            if (!defaultPrevented) {
                this.activeId = selectedTab.id;
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        // auto-correct activeId that might have been set incorrectly as input
        /** @type {?} */
        let activeTab = this._getTabById(this.activeId);
        this.activeId = activeTab ? activeTab.id : (this.tabs.length ? this.tabs.first.id : null);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    _getTabById(id) {
        /** @type {?} */
        let tabsWithId = this.tabs.filter(tab => tab.id === id);
        return tabsWithId.length ? tabsWithId[0] : null;
    }
}
NgbTabset.decorators = [
    { type: Component, args: [{
                selector: 'ngb-tabset',
                exportAs: 'ngbTabset',
                template: `
    <ul [class]="'nav nav-' + type + (orientation == 'horizontal'?  ' ' + justifyClass : ' flex-column')" role="tablist">
      <li class="nav-item" *ngFor="let tab of tabs">
        <a [id]="tab.id" class="nav-link" [class.active]="tab.id === activeId" [class.disabled]="tab.disabled"
          href (click)="select(tab.id); $event.preventDefault()" role="tab" [attr.tabindex]="(tab.disabled ? '-1': undefined)"
          [attr.aria-controls]="(!destroyOnHide || tab.id === activeId ? tab.id + '-panel' : null)"
          [attr.aria-expanded]="tab.id === activeId" [attr.aria-disabled]="tab.disabled">
          {{tab.title}}<ng-template [ngTemplateOutlet]="tab.titleTpl?.templateRef"></ng-template>
        </a>
      </li>
    </ul>
    <div class="tab-content">
      <ng-template ngFor let-tab [ngForOf]="tabs">
        <div
          class="tab-pane {{tab.id === activeId ? 'active' : null}}"
          *ngIf="!destroyOnHide || tab.id === activeId"
          role="tabpanel"
          [attr.aria-labelledby]="tab.id" id="{{tab.id}}-panel"
          [attr.aria-expanded]="tab.id === activeId">
          <ng-template [ngTemplateOutlet]="tab.contentTpl?.templateRef"></ng-template>
        </div>
      </ng-template>
    </div>
  `
            }] }
];
/** @nocollapse */
NgbTabset.ctorParameters = () => [
    { type: NgbTabsetConfig }
];
NgbTabset.propDecorators = {
    tabs: [{ type: ContentChildren, args: [NgbTab,] }],
    activeId: [{ type: Input }],
    destroyOnHide: [{ type: Input }],
    justify: [{ type: Input }],
    orientation: [{ type: Input }],
    type: [{ type: Input }],
    tabChange: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_TABSET_DIRECTIVES = [NgbTabset, NgbTab, NgbTabContent, NgbTabTitle];
class NgbTabsetModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbTabsetModule }; }
}
NgbTabsetModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_TABSET_DIRECTIVES, exports: NGB_TABSET_DIRECTIVES, imports: [CommonModule] },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbTime {
    /**
     * @param {?=} hour
     * @param {?=} minute
     * @param {?=} second
     */
    constructor(hour, minute, second) {
        this.hour = toInteger(hour);
        this.minute = toInteger(minute);
        this.second = toInteger(second);
    }
    /**
     * @param {?=} step
     * @return {?}
     */
    changeHour(step = 1) { this.updateHour((isNaN(this.hour) ? 0 : this.hour) + step); }
    /**
     * @param {?} hour
     * @return {?}
     */
    updateHour(hour) {
        if (isNumber(hour)) {
            this.hour = (hour < 0 ? 24 + hour : hour) % 24;
        }
        else {
            this.hour = NaN;
        }
    }
    /**
     * @param {?=} step
     * @return {?}
     */
    changeMinute(step = 1) { this.updateMinute((isNaN(this.minute) ? 0 : this.minute) + step); }
    /**
     * @param {?} minute
     * @return {?}
     */
    updateMinute(minute) {
        if (isNumber(minute)) {
            this.minute = minute % 60 < 0 ? 60 + minute % 60 : minute % 60;
            this.changeHour(Math.floor(minute / 60));
        }
        else {
            this.minute = NaN;
        }
    }
    /**
     * @param {?=} step
     * @return {?}
     */
    changeSecond(step = 1) { this.updateSecond((isNaN(this.second) ? 0 : this.second) + step); }
    /**
     * @param {?} second
     * @return {?}
     */
    updateSecond(second) {
        if (isNumber(second)) {
            this.second = second < 0 ? 60 + second % 60 : second % 60;
            this.changeMinute(Math.floor(second / 60));
        }
        else {
            this.second = NaN;
        }
    }
    /**
     * @param {?=} checkSecs
     * @return {?}
     */
    isValid(checkSecs = true) {
        return isNumber(this.hour) && isNumber(this.minute) && (checkSecs ? isNumber(this.second) : true);
    }
    /**
     * @return {?}
     */
    toString() { return `${this.hour || 0}:${this.minute || 0}:${this.second || 0}`; }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbTimepicker component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the timepickers used in the application.
 */
class NgbTimepickerConfig {
    constructor() {
        this.meridian = false;
        this.spinners = true;
        this.seconds = false;
        this.hourStep = 1;
        this.minuteStep = 1;
        this.secondStep = 1;
        this.disabled = false;
        this.readonlyInputs = false;
        this.size = 'medium';
    }
}
NgbTimepickerConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbTimepickerConfig.ngInjectableDef = defineInjectable({ factory: function NgbTimepickerConfig_Factory() { return new NgbTimepickerConfig(); }, token: NgbTimepickerConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @return {?}
 */
function NGB_DATEPICKER_TIME_ADAPTER_FACTORY() {
    return new NgbTimeStructAdapter();
}
/**
 * Abstract type serving as a DI token for the service converting from your application Time model to internal
 * NgbTimeStruct model.
 * A default implementation converting from and to NgbTimeStruct is provided for retro-compatibility,
 * but you can provide another implementation to use an alternative format, ie for using with native Date Object.
 *
 * \@since 2.2.0
 * @abstract
 * @template T
 */
class NgbTimeAdapter {
}
NgbTimeAdapter.decorators = [
    { type: Injectable, args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_TIME_ADAPTER_FACTORY },] }
];
/** @nocollapse */ NgbTimeAdapter.ngInjectableDef = defineInjectable({ factory: NGB_DATEPICKER_TIME_ADAPTER_FACTORY, token: NgbTimeAdapter, providedIn: "root" });
class NgbTimeStructAdapter extends NgbTimeAdapter {
    /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     * @param {?} time
     * @return {?}
     */
    fromModel(time) {
        return (time && isInteger(time.hour) && isInteger(time.minute)) ?
            { hour: time.hour, minute: time.minute, second: isInteger(time.second) ? time.second : null } :
            null;
    }
    /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     * @param {?} time
     * @return {?}
     */
    toModel(time) {
        return (time && isInteger(time.hour) && isInteger(time.minute)) ?
            { hour: time.hour, minute: time.minute, second: isInteger(time.second) ? time.second : null } :
            null;
    }
}
NgbTimeStructAdapter.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_TIMEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbTimepicker),
    multi: true
};
/**
 * A lightweight & configurable timepicker directive.
 */
class NgbTimepicker {
    /**
     * @param {?} config
     * @param {?} _ngbTimeAdapter
     */
    constructor(config, _ngbTimeAdapter) {
        this._ngbTimeAdapter = _ngbTimeAdapter;
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this.meridian = config.meridian;
        this.spinners = config.spinners;
        this.seconds = config.seconds;
        this.hourStep = config.hourStep;
        this.minuteStep = config.minuteStep;
        this.secondStep = config.secondStep;
        this.disabled = config.disabled;
        this.readonlyInputs = config.readonlyInputs;
        this.size = config.size;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        /** @type {?} */
        const structValue = this._ngbTimeAdapter.fromModel(value);
        this.model = structValue ? new NgbTime(structValue.hour, structValue.minute, structValue.second) : new NgbTime();
        if (!this.seconds && (!structValue || !isNumber(structValue.second))) {
            this.model.second = 0;
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    /**
     * @param {?} step
     * @return {?}
     */
    changeHour(step) {
        this.model.changeHour(step);
        this.propagateModelChange();
    }
    /**
     * @param {?} step
     * @return {?}
     */
    changeMinute(step) {
        this.model.changeMinute(step);
        this.propagateModelChange();
    }
    /**
     * @param {?} step
     * @return {?}
     */
    changeSecond(step) {
        this.model.changeSecond(step);
        this.propagateModelChange();
    }
    /**
     * @param {?} newVal
     * @return {?}
     */
    updateHour(newVal) {
        /** @type {?} */
        const isPM = this.model.hour >= 12;
        /** @type {?} */
        const enteredHour = toInteger(newVal);
        if (this.meridian && (isPM && enteredHour < 12 || !isPM && enteredHour === 12)) {
            this.model.updateHour(enteredHour + 12);
        }
        else {
            this.model.updateHour(enteredHour);
        }
        this.propagateModelChange();
    }
    /**
     * @param {?} newVal
     * @return {?}
     */
    updateMinute(newVal) {
        this.model.updateMinute(toInteger(newVal));
        this.propagateModelChange();
    }
    /**
     * @param {?} newVal
     * @return {?}
     */
    updateSecond(newVal) {
        this.model.updateSecond(toInteger(newVal));
        this.propagateModelChange();
    }
    /**
     * @return {?}
     */
    toggleMeridian() {
        if (this.meridian) {
            this.changeHour(12);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    formatHour(value) {
        if (isNumber(value)) {
            if (this.meridian) {
                return padNumber(value % 12 === 0 ? 12 : value % 12);
            }
            else {
                return padNumber(value % 24);
            }
        }
        else {
            return padNumber(NaN);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    formatMinSec(value) { return padNumber(value); }
    /**
     * @return {?}
     */
    get isSmallSize() { return this.size === 'small'; }
    /**
     * @return {?}
     */
    get isLargeSize() { return this.size === 'large'; }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['seconds'] && !this.seconds && this.model && !isNumber(this.model.second)) {
            this.model.second = 0;
            this.propagateModelChange(false);
        }
    }
    /**
     * @param {?=} touched
     * @return {?}
     */
    propagateModelChange(touched = true) {
        if (touched) {
            this.onTouched();
        }
        if (this.model.isValid(this.seconds)) {
            this.onChange(this._ngbTimeAdapter.toModel({ hour: this.model.hour, minute: this.model.minute, second: this.model.second }));
        }
        else {
            this.onChange(this._ngbTimeAdapter.toModel(null));
        }
    }
}
NgbTimepicker.decorators = [
    { type: Component, args: [{
                selector: 'ngb-timepicker',
                template: `
    <fieldset [disabled]="disabled" [class.disabled]="disabled">
      <div class="ngb-tp">
        <div class="ngb-tp-input-container ngb-tp-hour">
          <button *ngIf="spinners" type="button" (click)="changeHour(hourStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.increment-hours">Increment hours</span>
          </button>
          <input type="text" class="form-control" [class.form-control-sm]="isSmallSize" [class.form-control-lg]="isLargeSize" maxlength="2"
            placeholder="HH" i18n-placeholder="@@ngb.timepicker.HH"
            [value]="formatHour(model?.hour)" (change)="updateHour($event.target.value)"
            [readonly]="readonlyInputs" [disabled]="disabled" aria-label="Hours" i18n-aria-label="@@ngb.timepicker.hours">
          <button *ngIf="spinners" type="button" (click)="changeHour(-hourStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron bottom"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.decrement-hours">Decrement hours</span>
          </button>
        </div>
        <div class="ngb-tp-spacer">:</div>
        <div class="ngb-tp-input-container ngb-tp-minute">
          <button *ngIf="spinners" type="button" (click)="changeMinute(minuteStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.increment-minutes">Increment minutes</span>
          </button>
          <input type="text" class="form-control" [class.form-control-sm]="isSmallSize" [class.form-control-lg]="isLargeSize" maxlength="2"
            placeholder="MM" i18n-placeholder="@@ngb.timepicker.MM"
            [value]="formatMinSec(model?.minute)" (change)="updateMinute($event.target.value)"
            [readonly]="readonlyInputs" [disabled]="disabled" aria-label="Minutes" i18n-aria-label="@@ngb.timepicker.minutes">
          <button *ngIf="spinners" type="button" (click)="changeMinute(-minuteStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize"  [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron bottom"></span>
            <span class="sr-only"  i18n="@@ngb.timepicker.decrement-minutes">Decrement minutes</span>
          </button>
        </div>
        <div *ngIf="seconds" class="ngb-tp-spacer">:</div>
        <div *ngIf="seconds" class="ngb-tp-input-container ngb-tp-second">
          <button *ngIf="spinners" type="button" (click)="changeSecond(secondStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.increment-seconds">Increment seconds</span>
          </button>
          <input type="text" class="form-control" [class.form-control-sm]="isSmallSize" [class.form-control-lg]="isLargeSize" maxlength="2"
            placeholder="SS" i18n-placeholder="@@ngb.timepicker.SS"
            [value]="formatMinSec(model?.second)" (change)="updateSecond($event.target.value)"
            [readonly]="readonlyInputs" [disabled]="disabled" aria-label="Seconds" i18n-aria-label="@@ngb.timepicker.seconds">
          <button *ngIf="spinners" type="button" (click)="changeSecond(-secondStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize"  [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron bottom"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.decrement-seconds">Decrement seconds</span>
          </button>
        </div>
        <div *ngIf="meridian" class="ngb-tp-spacer"></div>
        <div *ngIf="meridian" class="ngb-tp-meridian">
          <button type="button" class="btn btn-outline-primary" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize"
            [disabled]="disabled" [class.disabled]="disabled"
                  (click)="toggleMeridian()">
            <ng-container *ngIf="model?.hour >= 12; else am" i18n="@@ngb.timepicker.PM">PM</ng-container>
            <ng-template #am i18n="@@ngb.timepicker.AM">AM</ng-template>
          </button>
        </div>
      </div>
    </fieldset>
  `,
                providers: [NGB_TIMEPICKER_VALUE_ACCESSOR],
                styles: [":host{font-size:1rem}.ngb-tp{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.ngb-tp-input-container{width:4em}.ngb-tp-hour,.ngb-tp-meridian,.ngb-tp-minute,.ngb-tp-second{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:center;align-items:center;-ms-flex-pack:distribute;justify-content:space-around}.ngb-tp-spacer{width:1em;text-align:center}.chevron::before{border-style:solid;border-width:.29em .29em 0 0;content:'';display:inline-block;height:.69em;left:.05em;position:relative;top:.15em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);vertical-align:middle;width:.69em}.chevron.bottom:before{top:-.3em;-webkit-transform:rotate(135deg);transform:rotate(135deg)}input{text-align:center}"]
            }] }
];
/** @nocollapse */
NgbTimepicker.ctorParameters = () => [
    { type: NgbTimepickerConfig },
    { type: NgbTimeAdapter }
];
NgbTimepicker.propDecorators = {
    meridian: [{ type: Input }],
    spinners: [{ type: Input }],
    seconds: [{ type: Input }],
    hourStep: [{ type: Input }],
    minuteStep: [{ type: Input }],
    secondStep: [{ type: Input }],
    readonlyInputs: [{ type: Input }],
    size: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbTimepickerModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbTimepickerModule }; }
}
NgbTimepickerModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbTimepicker], exports: [NgbTimepicker], imports: [CommonModule] },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbTooltip directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tooltips used in the application.
 */
class NgbTooltipConfig {
    constructor() {
        this.autoClose = true;
        this.placement = 'top';
        this.triggers = 'hover';
        this.disableTooltip = false;
    }
}
NgbTooltipConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbTooltipConfig.ngInjectableDef = defineInjectable({ factory: function NgbTooltipConfig_Factory() { return new NgbTooltipConfig(); }, token: NgbTooltipConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
let nextId$5 = 0;
class NgbTooltipWindow {
    /**
     * @param {?} _element
     * @param {?} _renderer
     */
    constructor(_element, _renderer) {
        this._element = _element;
        this._renderer = _renderer;
        this.placement = 'top';
    }
    /**
     * @param {?} _placement
     * @return {?}
     */
    applyPlacement(_placement) {
        // remove the current placement classes
        this._renderer.removeClass(this._element.nativeElement, 'bs-tooltip-' + this.placement.toString().split('-')[0]);
        this._renderer.removeClass(this._element.nativeElement, 'bs-tooltip-' + this.placement.toString());
        // set the new placement classes
        this.placement = _placement;
        // apply the new placement
        this._renderer.addClass(this._element.nativeElement, 'bs-tooltip-' + this.placement.toString().split('-')[0]);
        this._renderer.addClass(this._element.nativeElement, 'bs-tooltip-' + this.placement.toString());
    }
    /**
     * Tells whether the event has been triggered from this component's subtree or not.
     *
     * @param {?} event the event to check
     *
     * @return {?} whether the event has been triggered from this component's subtree or not.
     */
    isEventFrom(event) { return this._element.nativeElement.contains((/** @type {?} */ (event.target))); }
}
NgbTooltipWindow.decorators = [
    { type: Component, args: [{
                selector: 'ngb-tooltip-window',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class]': '"tooltip show bs-tooltip-" + placement.split("-")[0]+" bs-tooltip-" + placement + (tooltipClass ? " " + tooltipClass : "")',
                    'role': 'tooltip',
                    '[id]': 'id'
                },
                template: `<div class="arrow"></div><div class="tooltip-inner"><ng-content></ng-content></div>`,
                styles: ["ngb-tooltip-window.bs-tooltip-bottom .arrow,ngb-tooltip-window.bs-tooltip-top .arrow{left:calc(50% - .4rem)}ngb-tooltip-window.bs-tooltip-bottom-left .arrow,ngb-tooltip-window.bs-tooltip-top-left .arrow{left:1em}ngb-tooltip-window.bs-tooltip-bottom-right .arrow,ngb-tooltip-window.bs-tooltip-top-right .arrow{left:auto;right:.8rem}ngb-tooltip-window.bs-tooltip-left .arrow,ngb-tooltip-window.bs-tooltip-right .arrow{top:calc(50% - .4rem)}ngb-tooltip-window.bs-tooltip-left-top .arrow,ngb-tooltip-window.bs-tooltip-right-top .arrow{top:.4rem}ngb-tooltip-window.bs-tooltip-left-bottom .arrow,ngb-tooltip-window.bs-tooltip-right-bottom .arrow{top:auto;bottom:.4rem}"]
            }] }
];
/** @nocollapse */
NgbTooltipWindow.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
NgbTooltipWindow.propDecorators = {
    placement: [{ type: Input }],
    id: [{ type: Input }],
    tooltipClass: [{ type: Input }]
};
/**
 * A lightweight, extensible directive for fancy tooltip creation.
 */
class NgbTooltip {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} injector
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     * @param {?} config
     * @param {?} _ngZone
     * @param {?} _document
     */
    constructor(_elementRef, _renderer, injector, componentFactoryResolver, viewContainerRef, config, _ngZone, _document) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._document = _document;
        /**
         * Emits an event when the tooltip is shown
         */
        this.shown = new EventEmitter();
        /**
         * Emits an event when the tooltip is hidden
         */
        this.hidden = new EventEmitter();
        this._ngbTooltipWindowId = `ngb-tooltip-${nextId$5++}`;
        this.autoClose = config.autoClose;
        this.placement = config.placement;
        this.triggers = config.triggers;
        this.container = config.container;
        this.disableTooltip = config.disableTooltip;
        this.tooltipClass = config.tooltipClass;
        this._popupService = new PopupService(NgbTooltipWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);
        this._zoneSubscription = _ngZone.onStable.subscribe(() => {
            if (this._windowRef) {
                this._windowRef.instance.applyPlacement(positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body'));
            }
        });
    }
    /**
     * Content to be displayed as tooltip. If falsy, the tooltip won't open.
     * @param {?} value
     * @return {?}
     */
    set ngbTooltip(value) {
        this._ngbTooltip = value;
        if (!value && this._windowRef) {
            this.close();
        }
    }
    /**
     * @return {?}
     */
    get ngbTooltip() { return this._ngbTooltip; }
    /**
     * Opens an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * The context is an optional value to be injected into the tooltip template when it is created.
     * @param {?=} context
     * @return {?}
     */
    open(context) {
        if (!this._windowRef && this._ngbTooltip && !this.disableTooltip) {
            this._windowRef = this._popupService.open(this._ngbTooltip, context);
            this._windowRef.instance.tooltipClass = this.tooltipClass;
            this._windowRef.instance.id = this._ngbTooltipWindowId;
            this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbTooltipWindowId);
            if (this.container === 'body') {
                this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            this._windowRef.instance.placement = Array.isArray(this.placement) ? this.placement[0] : this.placement;
            // apply styling to set basic css-classes on target element, before going for positioning
            this._windowRef.changeDetectorRef.detectChanges();
            this._windowRef.changeDetectorRef.markForCheck();
            // position tooltip along the element
            this._windowRef.instance.applyPlacement(positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body'));
            if (this.autoClose) {
                this._ngZone.runOutsideAngular(() => {
                    // prevents automatic closing right after an opening by putting a guard for the time of one event handling
                    // pass
                    // use case: click event would reach an element opening the tooltip first, then reach the autoClose handler
                    // which would close it
                    /** @type {?} */
                    let justOpened = true;
                    requestAnimationFrame(() => justOpened = false);
                    /** @type {?} */
                    const escapes$ = fromEvent(this._document, 'keyup')
                        .pipe(takeUntil(this.hidden), 
                    // tslint:disable-next-line:deprecation
                    filter(event => event.which === Key.Escape));
                    /** @type {?} */
                    const clicks$ = fromEvent(this._document, 'click')
                        .pipe(takeUntil(this.hidden), filter(() => !justOpened), filter(event => this._shouldCloseFromClick(event)));
                    race([escapes$, clicks$]).subscribe(() => this._ngZone.run(() => this.close()));
                });
            }
            this.shown.emit();
        }
    }
    /**
     * Closes an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * @return {?}
     */
    close() {
        if (this._windowRef != null) {
            this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
            this._popupService.close();
            this._windowRef = null;
            this.hidden.emit();
        }
    }
    /**
     * Toggles an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * @return {?}
     */
    toggle() {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Returns whether or not the tooltip is currently being shown
     * @return {?}
     */
    isOpen() { return this._windowRef != null; }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._unregisterListenersFn = listenToTriggers(this._renderer, this._elementRef.nativeElement, this.triggers, this.open.bind(this), this.close.bind(this), this.toggle.bind(this));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.close();
        // This check is needed as it might happen that ngOnDestroy is called before ngOnInit
        // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
        if (this._unregisterListenersFn) {
            this._unregisterListenersFn();
        }
        this._zoneSubscription.unsubscribe();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _shouldCloseFromClick(event) {
        if (event.button !== 2) {
            if (this.autoClose === true) {
                return true;
            }
            else if (this.autoClose === 'inside' && this._isEventFromTooltip(event)) {
                return true;
            }
            else if (this.autoClose === 'outside' && !this._isEventFromTooltip(event)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _isEventFromTooltip(event) {
        /** @type {?} */
        const popup = this._windowRef.instance;
        return popup ? popup.isEventFrom(event) : false;
    }
}
NgbTooltip.decorators = [
    { type: Directive, args: [{ selector: '[ngbTooltip]', exportAs: 'ngbTooltip' },] }
];
/** @nocollapse */
NgbTooltip.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: Injector },
    { type: ComponentFactoryResolver },
    { type: ViewContainerRef },
    { type: NgbTooltipConfig },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
NgbTooltip.propDecorators = {
    autoClose: [{ type: Input }],
    placement: [{ type: Input }],
    triggers: [{ type: Input }],
    container: [{ type: Input }],
    disableTooltip: [{ type: Input }],
    tooltipClass: [{ type: Input }],
    shown: [{ type: Output }],
    hidden: [{ type: Output }],
    ngbTooltip: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbTooltipModule {
    /**
     * No need in forRoot anymore with tree-shakeable services
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbTooltipModule }; }
}
NgbTooltipModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbTooltip, NgbTooltipWindow], exports: [NgbTooltip], entryComponents: [NgbTooltipWindow] },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * A component that can be used inside a custom result template in order to highlight the term inside the text of the
 * result
 */
class NgbHighlight {
    constructor() {
        /**
         * The CSS class of the span elements wrapping the term inside the result
         */
        this.highlightClass = 'ngb-highlight';
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const resultStr = toString(this.result);
        /** @type {?} */
        const resultLC = resultStr.toLowerCase();
        /** @type {?} */
        const termLC = toString(this.term).toLowerCase();
        /** @type {?} */
        let currentIdx = 0;
        if (termLC.length > 0) {
            this.parts = resultLC.split(new RegExp(`(${regExpEscape(termLC)})`)).map((part) => {
                /** @type {?} */
                const originalPart = resultStr.substr(currentIdx, part.length);
                currentIdx += part.length;
                return originalPart;
            });
        }
        else {
            this.parts = [resultStr];
        }
    }
}
NgbHighlight.decorators = [
    { type: Component, args: [{
                selector: 'ngb-highlight',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: `<ng-template ngFor [ngForOf]="parts" let-part let-isOdd="odd">` +
                    `<span *ngIf="isOdd; else even" [class]="highlightClass">{{part}}</span><ng-template #even>{{part}}</ng-template>` +
                    `</ng-template>`,
                styles: [".ngb-highlight{font-weight:700}"]
            }] }
];
NgbHighlight.propDecorators = {
    highlightClass: [{ type: Input }],
    result: [{ type: Input }],
    term: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbTypeaheadWindow {
    constructor() {
        this.activeIdx = 0;
        /**
         * Flag indicating if the first row should be active initially
         */
        this.focusFirst = true;
        /**
         * A function used to format a given result before display. This function should return a formatted string without any
         * HTML markup
         */
        this.formatter = toString;
        /**
         * Event raised when user selects a particular result row
         */
        this.selectEvent = new EventEmitter();
        this.activeChangeEvent = new EventEmitter();
    }
    /**
     * @return {?}
     */
    hasActive() { return this.activeIdx > -1 && this.activeIdx < this.results.length; }
    /**
     * @return {?}
     */
    getActive() { return this.results[this.activeIdx]; }
    /**
     * @param {?} activeIdx
     * @return {?}
     */
    markActive(activeIdx) {
        this.activeIdx = activeIdx;
        this._activeChanged();
    }
    /**
     * @return {?}
     */
    next() {
        if (this.activeIdx === this.results.length - 1) {
            this.activeIdx = this.focusFirst ? (this.activeIdx + 1) % this.results.length : -1;
        }
        else {
            this.activeIdx++;
        }
        this._activeChanged();
    }
    /**
     * @return {?}
     */
    prev() {
        if (this.activeIdx < 0) {
            this.activeIdx = this.results.length - 1;
        }
        else if (this.activeIdx === 0) {
            this.activeIdx = this.focusFirst ? this.results.length - 1 : -1;
        }
        else {
            this.activeIdx--;
        }
        this._activeChanged();
    }
    /**
     * @return {?}
     */
    resetActive() {
        this.activeIdx = this.focusFirst ? 0 : -1;
        this._activeChanged();
    }
    /**
     * @param {?} item
     * @return {?}
     */
    select(item) { this.selectEvent.emit(item); }
    /**
     * @return {?}
     */
    ngOnInit() { this.resetActive(); }
    /**
     * @return {?}
     */
    _activeChanged() {
        this.activeChangeEvent.emit(this.activeIdx >= 0 ? this.id + '-' + this.activeIdx : undefined);
    }
}
NgbTypeaheadWindow.decorators = [
    { type: Component, args: [{
                selector: 'ngb-typeahead-window',
                exportAs: 'ngbTypeaheadWindow',
                host: { 'class': 'dropdown-menu show', 'role': 'listbox', '[id]': 'id' },
                template: `
    <ng-template #rt let-result="result" let-term="term" let-formatter="formatter">
      <ngb-highlight [result]="formatter(result)" [term]="term"></ngb-highlight>
    </ng-template>
    <ng-template ngFor [ngForOf]="results" let-result let-idx="index">
      <button type="button" class="dropdown-item" role="option"
        [id]="id + '-' + idx"
        [class.active]="idx === activeIdx"
        (mouseenter)="markActive(idx)"
        (click)="select(result)">
          <ng-template [ngTemplateOutlet]="resultTemplate || rt"
          [ngTemplateOutletContext]="{result: result, term: term, formatter: formatter}"></ng-template>
      </button>
    </ng-template>
  `
            }] }
];
NgbTypeaheadWindow.propDecorators = {
    id: [{ type: Input }],
    focusFirst: [{ type: Input }],
    results: [{ type: Input }],
    term: [{ type: Input }],
    formatter: [{ type: Input }],
    resultTemplate: [{ type: Input }],
    selectEvent: [{ type: Output, args: ['select',] }],
    activeChangeEvent: [{ type: Output, args: ['activeChange',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const ARIA_LIVE_DELAY = new InjectionToken('live announcer delay', { providedIn: 'root', factory: ARIA_LIVE_DELAY_FACTORY });
/**
 * @return {?}
 */
function ARIA_LIVE_DELAY_FACTORY() {
    return 100;
}
/**
 * @param {?} document
 * @param {?=} lazyCreate
 * @return {?}
 */
function getLiveElement(document, lazyCreate = false) {
    /** @type {?} */
    let element = (/** @type {?} */ (document.body.querySelector('#ngb-live')));
    if (element == null && lazyCreate) {
        element = document.createElement('div');
        element.setAttribute('id', 'ngb-live');
        element.setAttribute('aria-live', 'polite');
        element.setAttribute('aria-atomic', 'true');
        element.classList.add('sr-only');
        document.body.appendChild(element);
    }
    return element;
}
class Live {
    /**
     * @param {?} _document
     * @param {?} _delay
     */
    constructor(_document, _delay) {
        this._document = _document;
        this._delay = _delay;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        /** @type {?} */
        const element = getLiveElement(this._document);
        if (element) {
            element.parentElement.removeChild(element);
        }
    }
    /**
     * @param {?} message
     * @return {?}
     */
    say(message) {
        /** @type {?} */
        const element = getLiveElement(this._document, true);
        /** @type {?} */
        const delay = this._delay;
        element.textContent = '';
        /** @type {?} */
        const setText = () => element.textContent = message;
        if (delay === null) {
            setText();
        }
        else {
            setTimeout(setText, delay);
        }
    }
}
Live.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
Live.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [ARIA_LIVE_DELAY,] }] }
];
/** @nocollapse */ Live.ngInjectableDef = defineInjectable({ factory: function Live_Factory() { return new Live(inject(DOCUMENT), inject(ARIA_LIVE_DELAY)); }, token: Live, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbTypeahead component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the typeaheads used in the application.
 */
class NgbTypeaheadConfig {
    constructor() {
        this.editable = true;
        this.focusFirst = true;
        this.showHint = false;
        this.placement = 'bottom-left';
    }
}
NgbTypeaheadConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ NgbTypeaheadConfig.ngInjectableDef = defineInjectable({ factory: function NgbTypeaheadConfig_Factory() { return new NgbTypeaheadConfig(); }, token: NgbTypeaheadConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_TYPEAHEAD_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbTypeahead),
    multi: true
};
/** @type {?} */
let nextWindowId = 0;
/**
 * NgbTypeahead directive provides a simple way of creating powerful typeaheads from any text input
 */
class NgbTypeahead {
    /**
     * @param {?} _elementRef
     * @param {?} _viewContainerRef
     * @param {?} _renderer
     * @param {?} _injector
     * @param {?} componentFactoryResolver
     * @param {?} config
     * @param {?} ngZone
     * @param {?} _live
     */
    constructor(_elementRef, _viewContainerRef, _renderer, _injector, componentFactoryResolver, config, ngZone, _live) {
        this._elementRef = _elementRef;
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this._injector = _injector;
        this._live = _live;
        /**
         * Value for the configurable autocomplete attribute.
         * Defaults to 'off' to disable the native browser autocomplete, but this standard value does not seem
         * to be always correctly taken into account.
         *
         * \@since 2.1.0
         */
        this.autocomplete = 'off';
        /**
         * Placement of a typeahead accepts:
         *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
         *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
         * and array of above values.
         */
        this.placement = 'bottom-left';
        /**
         * An event emitted when a match is selected. Event payload is of type NgbTypeaheadSelectItemEvent.
         */
        this.selectItem = new EventEmitter();
        this.popupId = `ngb-typeahead-${nextWindowId++}`;
        this._onTouched = () => { };
        this._onChange = (_) => { };
        this.container = config.container;
        this.editable = config.editable;
        this.focusFirst = config.focusFirst;
        this.showHint = config.showHint;
        this.placement = config.placement;
        this._valueChanges = fromEvent(_elementRef.nativeElement, 'input')
            .pipe(map($event => ((/** @type {?} */ ($event.target))).value));
        this._resubscribeTypeahead = new BehaviorSubject(null);
        this._popupService = new PopupService(NgbTypeaheadWindow, _injector, _viewContainerRef, _renderer, componentFactoryResolver);
        this._zoneSubscription = ngZone.onStable.subscribe(() => {
            if (this.isPopupOpen()) {
                positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body');
            }
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        /** @type {?} */
        const inputValues$ = this._valueChanges.pipe(tap(value => {
            this._inputValueBackup = value;
            if (this.editable) {
                this._onChange(value);
            }
        }));
        /** @type {?} */
        const results$ = inputValues$.pipe(this.ngbTypeahead);
        /** @type {?} */
        const processedResults$ = results$.pipe(tap(() => {
            if (!this.editable) {
                this._onChange(undefined);
            }
        }));
        /** @type {?} */
        const userInput$ = this._resubscribeTypeahead.pipe(switchMap(() => processedResults$));
        this._subscription = this._subscribeToUserInput(userInput$);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._closePopup();
        this._unsubscribeFromUserInput();
        this._zoneSubscription.unsubscribe();
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this._onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this._onTouched = fn; }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) { this._writeInputValue(this._formatItemForInput(value)); }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDocumentClick(event) {
        if (event.target !== this._elementRef.nativeElement) {
            this.dismissPopup();
        }
    }
    /**
     * Dismisses typeahead popup window
     * @return {?}
     */
    dismissPopup() {
        if (this.isPopupOpen()) {
            this._closePopup();
            this._writeInputValue(this._inputValueBackup);
        }
    }
    /**
     * Returns true if the typeahead popup window is displayed
     * @return {?}
     */
    isPopupOpen() { return this._windowRef != null; }
    /**
     * @return {?}
     */
    handleBlur() {
        this._resubscribeTypeahead.next(null);
        this._onTouched();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleKeyDown(event) {
        if (!this.isPopupOpen()) {
            return;
        }
        // tslint:disable-next-line:deprecation
        const { which } = event;
        if (Key[toString(which)]) {
            switch (which) {
                case Key.ArrowDown:
                    event.preventDefault();
                    this._windowRef.instance.next();
                    this._showHint();
                    break;
                case Key.ArrowUp:
                    event.preventDefault();
                    this._windowRef.instance.prev();
                    this._showHint();
                    break;
                case Key.Enter:
                case Key.Tab:
                    /** @type {?} */
                    const result = this._windowRef.instance.getActive();
                    if (isDefined(result)) {
                        event.preventDefault();
                        event.stopPropagation();
                        this._selectResult(result);
                    }
                    this._closePopup();
                    break;
                case Key.Escape:
                    event.preventDefault();
                    this._resubscribeTypeahead.next(null);
                    this.dismissPopup();
                    break;
            }
        }
    }
    /**
     * @return {?}
     */
    _openPopup() {
        if (!this.isPopupOpen()) {
            this._inputValueBackup = this._elementRef.nativeElement.value;
            this._windowRef = this._popupService.open();
            this._windowRef.instance.id = this.popupId;
            this._windowRef.instance.selectEvent.subscribe((result) => this._selectResultClosePopup(result));
            this._windowRef.instance.activeChangeEvent.subscribe((activeId) => this.activeDescendant = activeId);
            if (this.container === 'body') {
                window.document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
        }
    }
    /**
     * @return {?}
     */
    _closePopup() {
        this._popupService.close();
        this._windowRef = null;
        this.activeDescendant = undefined;
    }
    /**
     * @param {?} result
     * @return {?}
     */
    _selectResult(result) {
        /** @type {?} */
        let defaultPrevented = false;
        this.selectItem.emit({ item: result, preventDefault: () => { defaultPrevented = true; } });
        this._resubscribeTypeahead.next(null);
        if (!defaultPrevented) {
            this.writeValue(result);
            this._onChange(result);
        }
    }
    /**
     * @param {?} result
     * @return {?}
     */
    _selectResultClosePopup(result) {
        this._selectResult(result);
        this._closePopup();
        this._elementRef.nativeElement.focus();
    }
    /**
     * @return {?}
     */
    _showHint() {
        if (this.showHint && this._windowRef.instance.hasActive() && this._inputValueBackup != null) {
            /** @type {?} */
            const userInputLowerCase = this._inputValueBackup.toLowerCase();
            /** @type {?} */
            const formattedVal = this._formatItemForInput(this._windowRef.instance.getActive());
            if (userInputLowerCase === formattedVal.substr(0, this._inputValueBackup.length).toLowerCase()) {
                this._writeInputValue(this._inputValueBackup + formattedVal.substr(this._inputValueBackup.length));
                this._elementRef.nativeElement['setSelectionRange'].apply(this._elementRef.nativeElement, [this._inputValueBackup.length, formattedVal.length]);
            }
            else {
                this.writeValue(this._windowRef.instance.getActive());
            }
        }
    }
    /**
     * @param {?} item
     * @return {?}
     */
    _formatItemForInput(item) {
        return item != null && this.inputFormatter ? this.inputFormatter(item) : toString(item);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    _writeInputValue(value) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', toString(value));
    }
    /**
     * @param {?} userInput$
     * @return {?}
     */
    _subscribeToUserInput(userInput$) {
        return userInput$.subscribe((results) => {
            if (!results || results.length === 0) {
                this._closePopup();
            }
            else {
                this._openPopup();
                this._windowRef.instance.focusFirst = this.focusFirst;
                this._windowRef.instance.results = results;
                this._windowRef.instance.term = this._elementRef.nativeElement.value;
                if (this.resultFormatter) {
                    this._windowRef.instance.formatter = this.resultFormatter;
                }
                if (this.resultTemplate) {
                    this._windowRef.instance.resultTemplate = this.resultTemplate;
                }
                this._windowRef.instance.resetActive();
                // The observable stream we are subscribing to might have async steps
                // and if a component containing typeahead is using the OnPush strategy
                // the change detection turn wouldn't be invoked automatically.
                this._windowRef.changeDetectorRef.detectChanges();
                this._showHint();
            }
            // live announcer
            /** @type {?} */
            const count = results ? results.length : 0;
            this._live.say(count === 0 ? 'No results available' : `${count} result${count === 1 ? '' : 's'} available`);
        });
    }
    /**
     * @return {?}
     */
    _unsubscribeFromUserInput() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this._subscription = null;
    }
}
NgbTypeahead.decorators = [
    { type: Directive, args: [{
                selector: 'input[ngbTypeahead]',
                exportAs: 'ngbTypeahead',
                host: {
                    '(blur)': 'handleBlur()',
                    '[class.open]': 'isPopupOpen()',
                    '(document:click)': 'onDocumentClick($event)',
                    '(keydown)': 'handleKeyDown($event)',
                    '[autocomplete]': 'autocomplete',
                    'autocapitalize': 'off',
                    'autocorrect': 'off',
                    'role': 'combobox',
                    'aria-multiline': 'false',
                    '[attr.aria-autocomplete]': 'showHint ? "both" : "list"',
                    '[attr.aria-activedescendant]': 'activeDescendant',
                    '[attr.aria-owns]': 'isPopupOpen() ? popupId : null',
                    '[attr.aria-expanded]': 'isPopupOpen()'
                },
                providers: [NGB_TYPEAHEAD_VALUE_ACCESSOR]
            },] }
];
/** @nocollapse */
NgbTypeahead.ctorParameters = () => [
    { type: ElementRef },
    { type: ViewContainerRef },
    { type: Renderer2 },
    { type: Injector },
    { type: ComponentFactoryResolver },
    { type: NgbTypeaheadConfig },
    { type: NgZone },
    { type: Live }
];
NgbTypeahead.propDecorators = {
    autocomplete: [{ type: Input }],
    container: [{ type: Input }],
    editable: [{ type: Input }],
    focusFirst: [{ type: Input }],
    inputFormatter: [{ type: Input }],
    ngbTypeahead: [{ type: Input }],
    resultFormatter: [{ type: Input }],
    resultTemplate: [{ type: Input }],
    showHint: [{ type: Input }],
    placement: [{ type: Input }],
    selectItem: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbTypeaheadModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbTypeaheadModule }; }
}
NgbTypeaheadModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgbTypeahead, NgbHighlight, NgbTypeaheadWindow],
                exports: [NgbTypeahead, NgbHighlight],
                imports: [CommonModule],
                entryComponents: [NgbTypeaheadWindow]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_MODULES = [
    NgbAccordionModule, NgbAlertModule, NgbButtonsModule, NgbCarouselModule, NgbCollapseModule, NgbDatepickerModule,
    NgbDropdownModule, NgbModalModule, NgbPaginationModule, NgbPopoverModule, NgbProgressbarModule, NgbRatingModule,
    NgbTabsetModule, NgbTimepickerModule, NgbTooltipModule, NgbTypeaheadModule
];
class NgbModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbModule }; }
}
NgbModule.decorators = [
    { type: NgModule, args: [{ imports: NGB_MODULES, exports: NGB_MODULES },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgbAccordionModule, NgbAccordionConfig, NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbAlertModule, NgbAlertConfig, NgbAlert, NgbButtonsModule, NgbCheckBox, NgbRadioGroup, NgbCarouselModule, NgbCarouselConfig, NgbCarousel, NgbSlide, NgbCollapseModule, NgbCollapse, NgbCalendar, NgbCalendarIslamicCivil, NgbCalendarIslamicUmalqura, NgbCalendarHebrew, NgbCalendarPersian, NgbDatepickerModule, NgbDatepickerI18n, NgbDatepickerI18nHebrew, NgbDatepickerConfig, NgbDate, NgbDateParserFormatter, NgbDateAdapter, NgbDateNativeAdapter, NgbDateNativeUTCAdapter, NgbDatepicker, NgbInputDatepicker, NgbDropdownModule, NgbDropdownConfig, NgbDropdown, NgbModalModule, NgbModal, NgbModalConfig, NgbActiveModal, NgbModalRef, ModalDismissReasons, NgbPaginationModule, NgbPaginationConfig, NgbPagination, NgbPopoverModule, NgbPopoverConfig, NgbPopover, NgbProgressbarModule, NgbProgressbarConfig, NgbProgressbar, NgbRatingModule, NgbRatingConfig, NgbRating, NgbTabsetModule, NgbTabsetConfig, NgbTabset, NgbTab, NgbTabContent, NgbTabTitle, NgbTimepickerModule, NgbTimepickerConfig, NgbTimepicker, NgbTimeAdapter, NgbTooltipModule, NgbTooltipConfig, NgbTooltip, NgbHighlight, NgbTypeaheadModule, NgbTypeaheadConfig, NgbTypeahead, NgbModule, NgbButtonLabel as ɵa, NgbRadio as ɵb, NGB_CAROUSEL_DIRECTIVES as ɵc, NGB_DATEPICKER_DATE_ADAPTER_FACTORY as ɵl, NgbDateStructAdapter as ɵm, NgbDatepickerDayView as ɵg, NGB_DATEPICKER_18N_FACTORY as ɵj, NgbDatepickerI18nDefault as ɵk, NgbDatepickerKeyMapService as ɵy, NgbDatepickerMonthView as ɵf, NgbDatepickerNavigation as ɵh, NgbDatepickerNavigationSelect as ɵi, NgbDatepickerService as ɵx, NgbCalendarHijri as ɵbg, NGB_DATEPICKER_CALENDAR_FACTORY as ɵd, NgbCalendarGregorian as ɵe, NGB_DATEPICKER_PARSER_FORMATTER_FACTORY as ɵn, NgbDateISOParserFormatter as ɵo, NgbDropdownAnchor as ɵq, NgbDropdownMenu as ɵp, NgbDropdownToggle as ɵr, NgbModalBackdrop as ɵz, NgbModalStack as ɵbb, NgbModalWindow as ɵba, NgbPopoverWindow as ɵs, NGB_DATEPICKER_TIME_ADAPTER_FACTORY as ɵt, NgbTimeStructAdapter as ɵu, NgbTooltipWindow as ɵv, NgbTypeaheadWindow as ɵw, ARIA_LIVE_DELAY as ɵbd, ARIA_LIVE_DELAY_FACTORY as ɵbe, Live as ɵbf, ContentRef as ɵbh, ScrollBar as ɵbc };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctYm9vdHN0cmFwLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC91dGlsL3V0aWwudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2FjY29yZGlvbi9hY2NvcmRpb24tY29uZmlnLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9hY2NvcmRpb24vYWNjb3JkaW9uLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9hY2NvcmRpb24vYWNjb3JkaW9uLm1vZHVsZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvYWxlcnQvYWxlcnQtY29uZmlnLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9hbGVydC9hbGVydC50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvYWxlcnQvYWxlcnQubW9kdWxlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9idXR0b25zL2xhYmVsLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9idXR0b25zL2NoZWNrYm94LnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9idXR0b25zL3JhZGlvLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9idXR0b25zL2J1dHRvbnMubW9kdWxlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9jYXJvdXNlbC9jYXJvdXNlbC1jb25maWcudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2Nhcm91c2VsL2Nhcm91c2VsLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9jYXJvdXNlbC9jYXJvdXNlbC5tb2R1bGUudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2NvbGxhcHNlL2NvbGxhcHNlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9jb2xsYXBzZS9jb2xsYXBzZS5tb2R1bGUudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvbmdiLWRhdGUudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvbmdiLWNhbGVuZGFyLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2RhdGVwaWNrZXItdG9vbHMudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1pMThuLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2RhdGVwaWNrZXItc2VydmljZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdXRpbC9rZXkudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1rZXltYXAtc2VydmljZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9kYXRlcGlja2VyLXZpZXctbW9kZWwudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1jb25maWcudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvYWRhcHRlcnMvbmdiLWRhdGUtYWRhcHRlci50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9kYXRlcGlja2VyLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2RhdGVwaWNrZXItbW9udGgtdmlldy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9kYXRlcGlja2VyLW5hdmlnYXRpb24udHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3V0aWwvZm9jdXMtdHJhcC50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdXRpbC9wb3NpdGlvbmluZy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9uZ2ItZGF0ZS1wYXJzZXItZm9ybWF0dGVyLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2RhdGVwaWNrZXItaW5wdXQudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1kYXktdmlldy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9kYXRlcGlja2VyLW5hdmlnYXRpb24tc2VsZWN0LnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2hpanJpL25nYi1jYWxlbmRhci1oaWpyaS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9oaWpyaS9uZ2ItY2FsZW5kYXItaXNsYW1pYy1jaXZpbC50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9oaWpyaS9uZ2ItY2FsZW5kYXItaXNsYW1pYy11bWFscXVyYS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9qYWxhbGkvamFsYWxpLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2phbGFsaS9uZ2ItY2FsZW5kYXItcGVyc2lhbi50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9oZWJyZXcvaGVicmV3LnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2hlYnJldy9uZ2ItY2FsZW5kYXItaGVicmV3LnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2hlYnJldy9kYXRlcGlja2VyLWkxOG4taGVicmV3LnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2FkYXB0ZXJzL25nYi1kYXRlLW5hdGl2ZS1hZGFwdGVyLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2FkYXB0ZXJzL25nYi1kYXRlLW5hdGl2ZS11dGMtYWRhcHRlci50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9kYXRlcGlja2VyLm1vZHVsZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZHJvcGRvd24vZHJvcGRvd24tY29uZmlnLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kcm9wZG93bi9kcm9wZG93bi50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZHJvcGRvd24vZHJvcGRvd24ubW9kdWxlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9tb2RhbC9tb2RhbC1jb25maWcudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3V0aWwvcG9wdXAudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3V0aWwvc2Nyb2xsYmFyLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9tb2RhbC9tb2RhbC1iYWNrZHJvcC50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvbW9kYWwvbW9kYWwtcmVmLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9tb2RhbC9tb2RhbC1kaXNtaXNzLXJlYXNvbnMudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL21vZGFsL21vZGFsLXdpbmRvdy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvbW9kYWwvbW9kYWwtc3RhY2sudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL21vZGFsL21vZGFsLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9tb2RhbC9tb2RhbC5tb2R1bGUudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3BhZ2luYXRpb24vcGFnaW5hdGlvbi1jb25maWcudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3BhZ2luYXRpb24vcGFnaW5hdGlvbi50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLm1vZHVsZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdXRpbC90cmlnZ2Vycy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvcG9wb3Zlci9wb3BvdmVyLWNvbmZpZy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvcG9wb3Zlci9wb3BvdmVyLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9wb3BvdmVyL3BvcG92ZXIubW9kdWxlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9wcm9ncmVzc2Jhci9wcm9ncmVzc2Jhci1jb25maWcudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3Byb2dyZXNzYmFyL3Byb2dyZXNzYmFyLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9wcm9ncmVzc2Jhci9wcm9ncmVzc2Jhci5tb2R1bGUudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3JhdGluZy9yYXRpbmctY29uZmlnLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9yYXRpbmcvcmF0aW5nLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9yYXRpbmcvcmF0aW5nLm1vZHVsZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdGFic2V0L3RhYnNldC1jb25maWcudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3RhYnNldC90YWJzZXQudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3RhYnNldC90YWJzZXQubW9kdWxlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC90aW1lcGlja2VyL25nYi10aW1lLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC90aW1lcGlja2VyL3RpbWVwaWNrZXItY29uZmlnLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC90aW1lcGlja2VyL25nYi10aW1lLWFkYXB0ZXIudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3RpbWVwaWNrZXIvdGltZXBpY2tlci50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdGltZXBpY2tlci90aW1lcGlja2VyLm1vZHVsZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdG9vbHRpcC90b29sdGlwLWNvbmZpZy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdG9vbHRpcC90b29sdGlwLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC90b29sdGlwL3Rvb2x0aXAubW9kdWxlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC90eXBlYWhlYWQvaGlnaGxpZ2h0LnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC90eXBlYWhlYWQvdHlwZWFoZWFkLXdpbmRvdy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdXRpbC9hY2Nlc3NpYmlsaXR5L2xpdmUudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3R5cGVhaGVhZC90eXBlYWhlYWQtY29uZmlnLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC90eXBlYWhlYWQvdHlwZWFoZWFkLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC90eXBlYWhlYWQvdHlwZWFoZWFkLm1vZHVsZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZTogYW55KTogbnVtYmVyIHtcbiAgcmV0dXJuIHBhcnNlSW50KGAke3ZhbHVlfWAsIDEwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICByZXR1cm4gKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwpID8gYCR7dmFsdWV9YCA6ICcnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsdWVJblJhbmdlKHZhbHVlOiBudW1iZXIsIG1heDogbnVtYmVyLCBtaW4gPSAwKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKHZhbHVlLCBtYXgpLCBtaW4pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmcodmFsdWU6IGFueSk6IHZhbHVlIGlzIHN0cmluZyB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXIodmFsdWU6IGFueSk6IHZhbHVlIGlzIG51bWJlciB7XG4gIHJldHVybiAhaXNOYU4odG9JbnRlZ2VyKHZhbHVlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ludGVnZXIodmFsdWU6IGFueSk6IHZhbHVlIGlzIG51bWJlciB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlZmluZWQodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhZE51bWJlcih2YWx1ZTogbnVtYmVyKSB7XG4gIGlmIChpc051bWJlcih2YWx1ZSkpIHtcbiAgICByZXR1cm4gYDAke3ZhbHVlfWAuc2xpY2UoLTIpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVnRXhwRXNjYXBlKHRleHQpIHtcbiAgcmV0dXJuIHRleHQucmVwbGFjZSgvWy1bXFxde30oKSorPy4sXFxcXF4kfCNcXHNdL2csICdcXFxcJCYnKTtcbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBzZXJ2aWNlIGZvciB0aGUgTmdiQWNjb3JkaW9uIGNvbXBvbmVudC5cbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSBhY2NvcmRpb25zIHVzZWQgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JBY2NvcmRpb25Db25maWcge1xuICBjbG9zZU90aGVycyA9IGZhbHNlO1xuICB0eXBlOiBzdHJpbmc7XG59XG4iLCJpbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7aXNTdHJpbmd9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmltcG9ydCB7TmdiQWNjb3JkaW9uQ29uZmlnfSBmcm9tICcuL2FjY29yZGlvbi1jb25maWcnO1xuXG5sZXQgbmV4dElkID0gMDtcblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBzaG91bGQgYmUgdXNlZCB0byB3cmFwIGFjY29yZGlvbiBwYW5lbCB0aXRsZXMgdGhhdCBuZWVkIHRvIGNvbnRhaW4gSFRNTCBtYXJrdXAgb3Igb3RoZXIgZGlyZWN0aXZlcy5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JQYW5lbFRpdGxlXSd9KVxuZXhwb3J0IGNsYXNzIE5nYlBhbmVsVGl0bGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4pIHt9XG59XG5cbi8qKlxuICogVGhpcyBkaXJlY3RpdmUgbXVzdCBiZSB1c2VkIHRvIHdyYXAgYWNjb3JkaW9uIHBhbmVsIGNvbnRlbnQuXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmctdGVtcGxhdGVbbmdiUGFuZWxDb250ZW50XSd9KVxuZXhwb3J0IGNsYXNzIE5nYlBhbmVsQ29udGVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55Pikge31cbn1cblxuLyoqXG4gKiBUaGUgTmdiUGFuZWwgZGlyZWN0aXZlIHJlcHJlc2VudHMgYW4gaW5kaXZpZHVhbCBwYW5lbCB3aXRoIHRoZSB0aXRsZSBhbmQgY29sbGFwc2libGVcbiAqIGNvbnRlbnRcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZ2ItcGFuZWwnfSlcbmV4cG9ydCBjbGFzcyBOZ2JQYW5lbCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudENoZWNrZWQge1xuICAvKipcbiAgICogIEEgZmxhZyBkZXRlcm1pbmluZyB3aGV0aGVyIHRoZSBwYW5lbCBpcyBkaXNhYmxlZCBvciBub3QuXG4gICAqICBXaGVuIGRpc2FibGVkLCB0aGUgcGFuZWwgY2Fubm90IGJlIHRvZ2dsZWQuXG4gICAqL1xuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiAgQW4gb3B0aW9uYWwgaWQgZm9yIHRoZSBwYW5lbC4gVGhlIGlkIHNob3VsZCBiZSB1bmlxdWUuXG4gICAqICBJZiBub3QgcHJvdmlkZWQsIGl0IHdpbGwgYmUgYXV0by1nZW5lcmF0ZWQuXG4gICAqL1xuICBASW5wdXQoKSBpZCA9IGBuZ2ItcGFuZWwtJHtuZXh0SWQrK31gO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgdGVsbGluZyBpZiB0aGUgcGFuZWwgaXMgY3VycmVudGx5IG9wZW5cbiAgICovXG4gIGlzT3BlbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiAgVGhlIHRpdGxlIGZvciB0aGUgcGFuZWwuXG4gICAqL1xuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiAgQWNjb3JkaW9uJ3MgdHlwZXMgb2YgcGFuZWxzIHRvIGJlIGFwcGxpZWQgcGVyIHBhbmVsIGJhc2lzLlxuICAgKiAgQm9vdHN0cmFwIHJlY29nbml6ZXMgdGhlIGZvbGxvd2luZyB0eXBlczogXCJwcmltYXJ5XCIsIFwic2Vjb25kYXJ5XCIsIFwic3VjY2Vzc1wiLCBcImRhbmdlclwiLCBcIndhcm5pbmdcIiwgXCJpbmZvXCIsIFwibGlnaHRcIlxuICAgKiBhbmQgXCJkYXJrXCJcbiAgICovXG4gIEBJbnB1dCgpIHR5cGU6IHN0cmluZztcblxuICB0aXRsZVRwbDogTmdiUGFuZWxUaXRsZSB8IG51bGw7XG4gIGNvbnRlbnRUcGw6IE5nYlBhbmVsQ29udGVudCB8IG51bGw7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihOZ2JQYW5lbFRpdGxlLCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgdGl0bGVUcGxzOiBRdWVyeUxpc3Q8TmdiUGFuZWxUaXRsZT47XG4gIEBDb250ZW50Q2hpbGRyZW4oTmdiUGFuZWxDb250ZW50LCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgY29udGVudFRwbHM6IFF1ZXJ5TGlzdDxOZ2JQYW5lbENvbnRlbnQ+O1xuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAvLyBXZSBhcmUgdXNpbmcgQENvbnRlbnRDaGlsZHJlbiBpbnN0ZWFkIG9mIEBDb250ZW50Q2hpbGQgYXMgaW4gdGhlIEFuZ3VsYXIgdmVyc2lvbiBiZWluZyB1c2VkXG4gICAgLy8gb25seSBAQ29udGVudENoaWxkcmVuIGFsbG93cyB1cyB0byBzcGVjaWZ5IHRoZSB7ZGVzY2VuZGFudHM6IGZhbHNlfSBvcHRpb24uXG4gICAgLy8gV2l0aG91dCB7ZGVzY2VuZGFudHM6IGZhbHNlfSB3ZSBhcmUgaGl0dGluZyBidWdzIGRlc2NyaWJlZCBpbjpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9pc3N1ZXMvMjI0MFxuICAgIHRoaXMudGl0bGVUcGwgPSB0aGlzLnRpdGxlVHBscy5maXJzdDtcbiAgICB0aGlzLmNvbnRlbnRUcGwgPSB0aGlzLmNvbnRlbnRUcGxzLmZpcnN0O1xuICB9XG59XG5cbi8qKlxuICogVGhlIHBheWxvYWQgb2YgdGhlIGNoYW5nZSBldmVudCBmaXJlZCByaWdodCBiZWZvcmUgdG9nZ2xpbmcgYW4gYWNjb3JkaW9uIHBhbmVsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiUGFuZWxDaGFuZ2VFdmVudCB7XG4gIC8qKlxuICAgKiBJZCBvZiB0aGUgYWNjb3JkaW9uIHBhbmVsIHRoYXQgaXMgdG9nZ2xlZFxuICAgKi9cbiAgcGFuZWxJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBwYW5lbCB3aWxsIGJlIG9wZW5lZCAodHJ1ZSkgb3IgY2xvc2VkIChmYWxzZSlcbiAgICovXG4gIG5leHRTdGF0ZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCB3aWxsIHByZXZlbnQgcGFuZWwgdG9nZ2xpbmcgaWYgY2FsbGVkXG4gICAqL1xuICBwcmV2ZW50RGVmYXVsdDogKCkgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBUaGUgTmdiQWNjb3JkaW9uIGRpcmVjdGl2ZSBpcyBhIGNvbGxlY3Rpb24gb2YgcGFuZWxzLlxuICogSXQgY2FuIGFzc3VyZSB0aGF0IG9ubHkgb25lIHBhbmVsIGNhbiBiZSBvcGVuZWQgYXQgYSB0aW1lLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItYWNjb3JkaW9uJyxcbiAgZXhwb3J0QXM6ICduZ2JBY2NvcmRpb24nLFxuICBob3N0OiB7J2NsYXNzJzogJ2FjY29yZGlvbicsICdyb2xlJzogJ3RhYmxpc3QnLCAnW2F0dHIuYXJpYS1tdWx0aXNlbGVjdGFibGVdJzogJyFjbG9zZU90aGVyUGFuZWxzJ30sXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1wYW5lbCBbbmdGb3JPZl09XCJwYW5lbHNcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjYXJkXCI+XG4gICAgICAgIDxkaXYgcm9sZT1cInRhYlwiIGlkPVwie3twYW5lbC5pZH19LWhlYWRlclwiIFtjbGFzc109XCInY2FyZC1oZWFkZXIgJyArIChwYW5lbC50eXBlID8gJ2JnLScrcGFuZWwudHlwZTogdHlwZSA/ICdiZy0nK3R5cGUgOiAnJylcIj5cbiAgICAgICAgICA8aDUgY2xhc3M9XCJtYi0wXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tbGlua1wiXG4gICAgICAgICAgICAgIChjbGljayk9XCJ0b2dnbGUocGFuZWwuaWQpXCIgW2Rpc2FibGVkXT1cInBhbmVsLmRpc2FibGVkXCIgW2NsYXNzLmNvbGxhcHNlZF09XCIhcGFuZWwuaXNPcGVuXCJcbiAgICAgICAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJwYW5lbC5pc09wZW5cIiBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cInBhbmVsLmlkXCI+XG4gICAgICAgICAgICAgIHt7cGFuZWwudGl0bGV9fTxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJwYW5lbC50aXRsZVRwbD8udGVtcGxhdGVSZWZcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9oNT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgaWQ9XCJ7e3BhbmVsLmlkfX1cIiByb2xlPVwidGFicGFuZWxcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwicGFuZWwuaWQgKyAnLWhlYWRlcidcIlxuICAgICAgICAgICAgIGNsYXNzPVwiY29sbGFwc2VcIiBbY2xhc3Muc2hvd109XCJwYW5lbC5pc09wZW5cIiAqbmdJZj1cIiFkZXN0cm95T25IaWRlIHx8IHBhbmVsLmlzT3BlblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWJvZHlcIj5cbiAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJwYW5lbC5jb250ZW50VHBsPy50ZW1wbGF0ZVJlZlwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JBY2NvcmRpb24gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkIHtcbiAgQENvbnRlbnRDaGlsZHJlbihOZ2JQYW5lbCkgcGFuZWxzOiBRdWVyeUxpc3Q8TmdiUGFuZWw+O1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvciBjb21tYSBzZXBhcmF0ZWQgc3RyaW5ncyBvZiBwYW5lbCBpZGVudGlmaWVycyB0aGF0IHNob3VsZCBiZSBvcGVuZWRcbiAgICovXG4gIEBJbnB1dCgpIGFjdGl2ZUlkczogc3RyaW5nIHwgc3RyaW5nW10gPSBbXTtcblxuICAvKipcbiAgICogIFdoZXRoZXIgdGhlIG90aGVyIHBhbmVscyBzaG91bGQgYmUgY2xvc2VkIHdoZW4gYSBwYW5lbCBpcyBvcGVuZWRcbiAgICovXG4gIEBJbnB1dCgnY2xvc2VPdGhlcnMnKSBjbG9zZU90aGVyUGFuZWxzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBjbG9zZWQgcGFuZWxzIHNob3VsZCBiZSBoaWRkZW4gd2l0aG91dCBkZXN0cm95aW5nIHRoZW1cbiAgICovXG4gIEBJbnB1dCgpIGRlc3Ryb3lPbkhpZGUgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiAgQWNjb3JkaW9uJ3MgdHlwZXMgb2YgcGFuZWxzIHRvIGJlIGFwcGxpZWQgZ2xvYmFsbHkuXG4gICAqICBCb290c3RyYXAgcmVjb2duaXplcyB0aGUgZm9sbG93aW5nIHR5cGVzOiBcInByaW1hcnlcIiwgXCJzZWNvbmRhcnlcIiwgXCJzdWNjZXNzXCIsIFwiZGFuZ2VyXCIsIFwid2FybmluZ1wiLCBcImluZm9cIiwgXCJsaWdodFwiXG4gICAqIGFuZCBcImRhcmtcbiAgICovXG4gIEBJbnB1dCgpIHR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogQSBwYW5lbCBjaGFuZ2UgZXZlbnQgZmlyZWQgcmlnaHQgYmVmb3JlIHRoZSBwYW5lbCB0b2dnbGUgaGFwcGVucy4gU2VlIE5nYlBhbmVsQ2hhbmdlRXZlbnQgZm9yIHBheWxvYWQgZGV0YWlsc1xuICAgKi9cbiAgQE91dHB1dCgpIHBhbmVsQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JQYW5lbENoYW5nZUV2ZW50PigpO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTmdiQWNjb3JkaW9uQ29uZmlnKSB7XG4gICAgdGhpcy50eXBlID0gY29uZmlnLnR5cGU7XG4gICAgdGhpcy5jbG9zZU90aGVyUGFuZWxzID0gY29uZmlnLmNsb3NlT3RoZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIHBhbmVsIHdpdGggYSBnaXZlbiBpZCBpcyBleHBhbmRlZCBvciBub3QuXG4gICAqL1xuICBpc0V4cGFuZGVkKHBhbmVsSWQ6IHN0cmluZyk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5hY3RpdmVJZHMuaW5kZXhPZihwYW5lbElkKSA+IC0xOyB9XG5cbiAgLyoqXG4gICAqIEV4cGFuZHMgYSBwYW5lbCB3aXRoIGEgZ2l2ZW4gaWQuIEhhcyBubyBlZmZlY3QgaWYgdGhlIHBhbmVsIGlzIGFscmVhZHkgZXhwYW5kZWQgb3IgZGlzYWJsZWQuXG4gICAqL1xuICBleHBhbmQocGFuZWxJZDogc3RyaW5nKTogdm9pZCB7IHRoaXMuX2NoYW5nZU9wZW5TdGF0ZSh0aGlzLl9maW5kUGFuZWxCeUlkKHBhbmVsSWQpLCB0cnVlKTsgfVxuXG4gIC8qKlxuICAgKiBFeHBhbmRzIGFsbCBwYW5lbHMgaWYgW2Nsb3NlT3RoZXJzXT1cImZhbHNlXCIuIEZvciB0aGUgW2Nsb3NlT3RoZXJzXT1cInRydWVcIiBjYXNlIHdpbGwgaGF2ZSBubyBlZmZlY3QgaWYgdGhlcmUgaXMgYW5cbiAgICogb3BlbiBwYW5lbCwgb3RoZXJ3aXNlIHRoZSBmaXJzdCBwYW5lbCB3aWxsIGJlIGV4cGFuZGVkLlxuICAgKi9cbiAgZXhwYW5kQWxsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNsb3NlT3RoZXJQYW5lbHMpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZUlkcy5sZW5ndGggPT09IDAgJiYgdGhpcy5wYW5lbHMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2NoYW5nZU9wZW5TdGF0ZSh0aGlzLnBhbmVscy5maXJzdCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFuZWxzLmZvckVhY2gocGFuZWwgPT4gdGhpcy5fY2hhbmdlT3BlblN0YXRlKHBhbmVsLCB0cnVlKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbGxhcHNlcyBhIHBhbmVsIHdpdGggYSBnaXZlbiBpZC4gSGFzIG5vIGVmZmVjdCBpZiB0aGUgcGFuZWwgaXMgYWxyZWFkeSBjb2xsYXBzZWQgb3IgZGlzYWJsZWQuXG4gICAqL1xuICBjb2xsYXBzZShwYW5lbElkOiBzdHJpbmcpIHsgdGhpcy5fY2hhbmdlT3BlblN0YXRlKHRoaXMuX2ZpbmRQYW5lbEJ5SWQocGFuZWxJZCksIGZhbHNlKTsgfVxuXG4gIC8qKlxuICAgKiBDb2xsYXBzZXMgYWxsIG9wZW4gcGFuZWxzLlxuICAgKi9cbiAgY29sbGFwc2VBbGwoKSB7XG4gICAgdGhpcy5wYW5lbHMuZm9yRWFjaCgocGFuZWwpID0+IHsgdGhpcy5fY2hhbmdlT3BlblN0YXRlKHBhbmVsLCBmYWxzZSk7IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb2dyYW1tYXRpY2FsbHkgdG9nZ2xlIGEgcGFuZWwgd2l0aCBhIGdpdmVuIGlkLiBIYXMgbm8gZWZmZWN0IGlmIHRoZSBwYW5lbCBpcyBkaXNhYmxlZC5cbiAgICovXG4gIHRvZ2dsZShwYW5lbElkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYW5lbCA9IHRoaXMuX2ZpbmRQYW5lbEJ5SWQocGFuZWxJZCk7XG4gICAgaWYgKHBhbmVsKSB7XG4gICAgICB0aGlzLl9jaGFuZ2VPcGVuU3RhdGUocGFuZWwsICFwYW5lbC5pc09wZW4pO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAvLyBhY3RpdmUgaWQgdXBkYXRlc1xuICAgIGlmIChpc1N0cmluZyh0aGlzLmFjdGl2ZUlkcykpIHtcbiAgICAgIHRoaXMuYWN0aXZlSWRzID0gdGhpcy5hY3RpdmVJZHMuc3BsaXQoL1xccyosXFxzKi8pO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBwYW5lbHMgb3BlbiBzdGF0ZXNcbiAgICB0aGlzLnBhbmVscy5mb3JFYWNoKHBhbmVsID0+IHBhbmVsLmlzT3BlbiA9ICFwYW5lbC5kaXNhYmxlZCAmJiB0aGlzLmFjdGl2ZUlkcy5pbmRleE9mKHBhbmVsLmlkKSA+IC0xKTtcblxuICAgIC8vIGNsb3NlT3RoZXJzIHVwZGF0ZXNcbiAgICBpZiAodGhpcy5hY3RpdmVJZHMubGVuZ3RoID4gMSAmJiB0aGlzLmNsb3NlT3RoZXJQYW5lbHMpIHtcbiAgICAgIHRoaXMuX2Nsb3NlT3RoZXJzKHRoaXMuYWN0aXZlSWRzWzBdKTtcbiAgICAgIHRoaXMuX3VwZGF0ZUFjdGl2ZUlkcygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NoYW5nZU9wZW5TdGF0ZShwYW5lbDogTmdiUGFuZWwsIG5leHRTdGF0ZTogYm9vbGVhbikge1xuICAgIGlmIChwYW5lbCAmJiAhcGFuZWwuZGlzYWJsZWQgJiYgcGFuZWwuaXNPcGVuICE9PSBuZXh0U3RhdGUpIHtcbiAgICAgIGxldCBkZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XG5cbiAgICAgIHRoaXMucGFuZWxDaGFuZ2UuZW1pdChcbiAgICAgICAgICB7cGFuZWxJZDogcGFuZWwuaWQsIG5leHRTdGF0ZTogbmV4dFN0YXRlLCBwcmV2ZW50RGVmYXVsdDogKCkgPT4geyBkZWZhdWx0UHJldmVudGVkID0gdHJ1ZTsgfX0pO1xuXG4gICAgICBpZiAoIWRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgcGFuZWwuaXNPcGVuID0gbmV4dFN0YXRlO1xuXG4gICAgICAgIGlmIChuZXh0U3RhdGUgJiYgdGhpcy5jbG9zZU90aGVyUGFuZWxzKSB7XG4gICAgICAgICAgdGhpcy5fY2xvc2VPdGhlcnMocGFuZWwuaWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZUFjdGl2ZUlkcygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Nsb3NlT3RoZXJzKHBhbmVsSWQ6IHN0cmluZykge1xuICAgIHRoaXMucGFuZWxzLmZvckVhY2gocGFuZWwgPT4ge1xuICAgICAgaWYgKHBhbmVsLmlkICE9PSBwYW5lbElkKSB7XG4gICAgICAgIHBhbmVsLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmluZFBhbmVsQnlJZChwYW5lbElkOiBzdHJpbmcpOiBOZ2JQYW5lbCB8IG51bGwgeyByZXR1cm4gdGhpcy5wYW5lbHMuZmluZChwID0+IHAuaWQgPT09IHBhbmVsSWQpOyB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlQWN0aXZlSWRzKCkge1xuICAgIHRoaXMuYWN0aXZlSWRzID0gdGhpcy5wYW5lbHMuZmlsdGVyKHBhbmVsID0+IHBhbmVsLmlzT3BlbiAmJiAhcGFuZWwuZGlzYWJsZWQpLm1hcChwYW5lbCA9PiBwYW5lbC5pZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7TmdiQWNjb3JkaW9uLCBOZ2JQYW5lbCwgTmdiUGFuZWxUaXRsZSwgTmdiUGFuZWxDb250ZW50fSBmcm9tICcuL2FjY29yZGlvbic7XG5cbmV4cG9ydCB7TmdiQWNjb3JkaW9uLCBOZ2JQYW5lbCwgTmdiUGFuZWxUaXRsZSwgTmdiUGFuZWxDb250ZW50LCBOZ2JQYW5lbENoYW5nZUV2ZW50fSBmcm9tICcuL2FjY29yZGlvbic7XG5leHBvcnQge05nYkFjY29yZGlvbkNvbmZpZ30gZnJvbSAnLi9hY2NvcmRpb24tY29uZmlnJztcblxuY29uc3QgTkdCX0FDQ09SRElPTl9ESVJFQ1RJVkVTID0gW05nYkFjY29yZGlvbiwgTmdiUGFuZWwsIE5nYlBhbmVsVGl0bGUsIE5nYlBhbmVsQ29udGVudF07XG5cbkBOZ01vZHVsZSh7ZGVjbGFyYXRpb25zOiBOR0JfQUNDT1JESU9OX0RJUkVDVElWRVMsIGV4cG9ydHM6IE5HQl9BQ0NPUkRJT05fRElSRUNUSVZFUywgaW1wb3J0czogW0NvbW1vbk1vZHVsZV19KVxuZXhwb3J0IGNsYXNzIE5nYkFjY29yZGlvbk1vZHVsZSB7XG4gIC8qKlxuICAgKiBJbXBvcnRpbmcgd2l0aCAnLmZvclJvb3QoKScgaXMgbm8gbG9uZ2VyIG5lY2Vzc2FyeSwgeW91IGNhbiBzaW1wbHkgaW1wb3J0IHRoZSBtb2R1bGUuXG4gICAqIFdpbGwgYmUgcmVtb3ZlZCBpbiA0LjAuMC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgMy4wLjBcbiAgICovXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMgeyByZXR1cm4ge25nTW9kdWxlOiBOZ2JBY2NvcmRpb25Nb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIE5nYkFsZXJ0IGNvbXBvbmVudC5cbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSBhbGVydHMgdXNlZCBpbiB0aGUgYXBwbGljYXRpb24uXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYkFsZXJ0Q29uZmlnIHtcbiAgZGlzbWlzc2libGUgPSB0cnVlO1xuICB0eXBlID0gJ3dhcm5pbmcnO1xufVxuIiwiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBSZW5kZXJlcjIsXG4gIEVsZW1lbnRSZWYsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtOZ2JBbGVydENvbmZpZ30gZnJvbSAnLi9hbGVydC1jb25maWcnO1xuXG4vKipcbiAqIEFsZXJ0cyBjYW4gYmUgdXNlZCB0byBwcm92aWRlIGZlZWRiYWNrIG1lc3NhZ2VzLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItYWxlcnQnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDogeydyb2xlJzogJ2FsZXJ0JywgJ2NsYXNzJzogJ2FsZXJ0JywgJ1tjbGFzcy5hbGVydC1kaXNtaXNzaWJsZV0nOiAnZGlzbWlzc2libGUnfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YnV0dG9uICpuZ0lmPVwiZGlzbWlzc2libGVcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLmFsZXJ0LmNsb3NlXCJcbiAgICAgIChjbGljayk9XCJjbG9zZUhhbmRsZXIoKVwiPlxuICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgYCxcbiAgc3R5bGVVcmxzOiBbJy4vYWxlcnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5nYkFsZXJ0IGltcGxlbWVudHMgT25Jbml0LFxuICAgIE9uQ2hhbmdlcyB7XG4gIC8qKlxuICAgKiBBIGZsYWcgaW5kaWNhdGluZyBpZiBhIGdpdmVuIGFsZXJ0IGNhbiBiZSBkaXNtaXNzZWQgKGNsb3NlZCkgYnkgYSB1c2VyLiBJZiB0aGlzIGZsYWcgaXMgc2V0LCBhIGNsb3NlIGJ1dHRvbiAoaW4gYVxuICAgKiBmb3JtIG9mIGFuIMODwpcpIHdpbGwgYmUgZGlzcGxheWVkLlxuICAgKi9cbiAgQElucHV0KCkgZGlzbWlzc2libGU6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBBbGVydCB0eXBlIChDU1MgY2xhc3MpLiBCb290c3RyYXAgNCByZWNvZ25pemVzIHRoZSBmb2xsb3dpbmcgdHlwZXM6IFwic3VjY2Vzc1wiLCBcImluZm9cIiwgXCJ3YXJuaW5nXCIsIFwiZGFuZ2VyXCIsXG4gICAqIFwicHJpbWFyeVwiLCBcInNlY29uZGFyeVwiLCBcImxpZ2h0XCIsIFwiZGFya1wiLlxuICAgKi9cbiAgQElucHV0KCkgdHlwZTogc3RyaW5nO1xuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBjbG9zZSBidXR0b24gaXMgY2xpY2tlZC4gVGhpcyBldmVudCBoYXMgbm8gcGF5bG9hZC4gT25seSByZWxldmFudCBmb3IgZGlzbWlzc2libGUgYWxlcnRzLlxuICAgKi9cbiAgQE91dHB1dCgpIGNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTmdiQWxlcnRDb25maWcsIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgICB0aGlzLmRpc21pc3NpYmxlID0gY29uZmlnLmRpc21pc3NpYmxlO1xuICAgIHRoaXMudHlwZSA9IGNvbmZpZy50eXBlO1xuICB9XG5cbiAgY2xvc2VIYW5kbGVyKCkgeyB0aGlzLmNsb3NlLmVtaXQobnVsbCk7IH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgdHlwZUNoYW5nZSA9IGNoYW5nZXNbJ3R5cGUnXTtcbiAgICBpZiAodHlwZUNoYW5nZSAmJiAhdHlwZUNoYW5nZS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCBgYWxlcnQtJHt0eXBlQ2hhbmdlLnByZXZpb3VzVmFsdWV9YCk7XG4gICAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGBhbGVydC0ke3R5cGVDaGFuZ2UuY3VycmVudFZhbHVlfWApO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkgeyB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGBhbGVydC0ke3RoaXMudHlwZX1gKTsgfVxufVxuIiwiaW1wb3J0IHtOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHtOZ2JBbGVydH0gZnJvbSAnLi9hbGVydCc7XG5cbmV4cG9ydCB7TmdiQWxlcnR9IGZyb20gJy4vYWxlcnQnO1xuZXhwb3J0IHtOZ2JBbGVydENvbmZpZ30gZnJvbSAnLi9hbGVydC1jb25maWcnO1xuXG5ATmdNb2R1bGUoe2RlY2xhcmF0aW9uczogW05nYkFsZXJ0XSwgZXhwb3J0czogW05nYkFsZXJ0XSwgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sIGVudHJ5Q29tcG9uZW50czogW05nYkFsZXJ0XX0pXG5leHBvcnQgY2xhc3MgTmdiQWxlcnRNb2R1bGUge1xuICAvKipcbiAgICogSW1wb3J0aW5nIHdpdGggJy5mb3JSb290KCknIGlzIG5vIGxvbmdlciBuZWNlc3NhcnksIHlvdSBjYW4gc2ltcGx5IGltcG9ydCB0aGUgbW9kdWxlLlxuICAgKiBXaWxsIGJlIHJlbW92ZWQgaW4gNC4wLjAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiQWxlcnRNb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge0RpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ2JCdXR0b25MYWJlbF0nLFxuICBob3N0OlxuICAgICAgeydbY2xhc3MuYnRuXSc6ICd0cnVlJywgJ1tjbGFzcy5hY3RpdmVdJzogJ2FjdGl2ZScsICdbY2xhc3MuZGlzYWJsZWRdJzogJ2Rpc2FibGVkJywgJ1tjbGFzcy5mb2N1c10nOiAnZm9jdXNlZCd9XG59KVxuZXhwb3J0IGNsYXNzIE5nYkJ1dHRvbkxhYmVsIHtcbiAgYWN0aXZlOiBib29sZWFuO1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgZm9jdXNlZDogYm9vbGVhbjtcbn1cbiIsImltcG9ydCB7RGlyZWN0aXZlLCBmb3J3YXJkUmVmLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQge05nYkJ1dHRvbkxhYmVsfSBmcm9tICcuL2xhYmVsJztcblxuY29uc3QgTkdCX0NIRUNLQk9YX1ZBTFVFX0FDQ0VTU09SID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiQ2hlY2tCb3gpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuXG4vKipcbiAqIEVhc2lseSBjcmVhdGUgQm9vdHN0cmFwLXN0eWxlIGNoZWNrYm94IGJ1dHRvbnMuIEEgdmFsdWUgb2YgYSBjaGVja2VkIGJ1dHRvbiBpcyBib3VuZCB0byBhIHZhcmlhYmxlXG4gKiBzcGVjaWZpZWQgdmlhIG5nTW9kZWwuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ2JCdXR0b25dW3R5cGU9Y2hlY2tib3hdJyxcbiAgaG9zdDoge1xuICAgICdhdXRvY29tcGxldGUnOiAnb2ZmJyxcbiAgICAnW2NoZWNrZWRdJzogJ2NoZWNrZWQnLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnKGNoYW5nZSknOiAnb25JbnB1dENoYW5nZSgkZXZlbnQpJyxcbiAgICAnKGZvY3VzKSc6ICdmb2N1c2VkID0gdHJ1ZScsXG4gICAgJyhibHVyKSc6ICdmb2N1c2VkID0gZmFsc2UnXG4gIH0sXG4gIHByb3ZpZGVyczogW05HQl9DSEVDS0JPWF9WQUxVRV9BQ0NFU1NPUl1cbn0pXG5leHBvcnQgY2xhc3MgTmdiQ2hlY2tCb3ggaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIGNoZWNrZWQ7XG5cbiAgLyoqXG4gICAqIEEgZmxhZyBpbmRpY2F0aW5nIGlmIGEgZ2l2ZW4gY2hlY2tib3ggYnV0dG9uIGlzIGRpc2FibGVkLlxuICAgKi9cbiAgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogVmFsdWUgdG8gYmUgcHJvcGFnYXRlZCBhcyBtb2RlbCB3aGVuIHRoZSBjaGVja2JveCBpcyBjaGVja2VkLlxuICAgKi9cbiAgQElucHV0KCkgdmFsdWVDaGVja2VkID0gdHJ1ZTtcblxuICAvKipcbiAgICogVmFsdWUgdG8gYmUgcHJvcGFnYXRlZCBhcyBtb2RlbCB3aGVuIHRoZSBjaGVja2JveCBpcyB1bmNoZWNrZWQuXG4gICAqL1xuICBASW5wdXQoKSB2YWx1ZVVuQ2hlY2tlZCA9IGZhbHNlO1xuXG4gIG9uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG4gIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIHNldCBmb2N1c2VkKGlzRm9jdXNlZDogYm9vbGVhbikge1xuICAgIHRoaXMuX2xhYmVsLmZvY3VzZWQgPSBpc0ZvY3VzZWQ7XG4gICAgaWYgKCFpc0ZvY3VzZWQpIHtcbiAgICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbGFiZWw6IE5nYkJ1dHRvbkxhYmVsKSB7fVxuXG4gIG9uSW5wdXRDaGFuZ2UoJGV2ZW50KSB7XG4gICAgY29uc3QgbW9kZWxUb1Byb3BhZ2F0ZSA9ICRldmVudC50YXJnZXQuY2hlY2tlZCA/IHRoaXMudmFsdWVDaGVja2VkIDogdGhpcy52YWx1ZVVuQ2hlY2tlZDtcbiAgICB0aGlzLm9uQ2hhbmdlKG1vZGVsVG9Qcm9wYWdhdGUpO1xuICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gICAgdGhpcy53cml0ZVZhbHVlKG1vZGVsVG9Qcm9wYWdhdGUpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uQ2hhbmdlID0gZm47IH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gYW55KTogdm9pZCB7IHRoaXMub25Ub3VjaGVkID0gZm47IH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLl9sYWJlbC5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy5jaGVja2VkID0gdmFsdWUgPT09IHRoaXMudmFsdWVDaGVja2VkO1xuICAgIHRoaXMuX2xhYmVsLmFjdGl2ZSA9IHRoaXMuY2hlY2tlZDtcbiAgfVxufVxuIiwiaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIElucHV0LCBPbkRlc3Ryb3ksIFJlbmRlcmVyMn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQge05nYkJ1dHRvbkxhYmVsfSBmcm9tICcuL2xhYmVsJztcblxuY29uc3QgTkdCX1JBRElPX1ZBTFVFX0FDQ0VTU09SID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiUmFkaW9Hcm91cCksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5sZXQgbmV4dElkID0gMDtcblxuLyoqXG4gKiBFYXNpbHkgY3JlYXRlIEJvb3RzdHJhcC1zdHlsZSByYWRpbyBidXR0b25zLiBBIHZhbHVlIG9mIGEgc2VsZWN0ZWQgYnV0dG9uIGlzIGJvdW5kIHRvIGEgdmFyaWFibGVcbiAqIHNwZWNpZmllZCB2aWEgbmdNb2RlbC5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbbmdiUmFkaW9Hcm91cF0nLCBob3N0OiB7J3JvbGUnOiAnZ3JvdXAnfSwgcHJvdmlkZXJzOiBbTkdCX1JBRElPX1ZBTFVFX0FDQ0VTU09SXX0pXG5leHBvcnQgY2xhc3MgTmdiUmFkaW9Hcm91cCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgcHJpdmF0ZSBfcmFkaW9zOiBTZXQ8TmdiUmFkaW8+ID0gbmV3IFNldDxOZ2JSYWRpbz4oKTtcbiAgcHJpdmF0ZSBfdmFsdWUgPSBudWxsO1xuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcblxuICBnZXQgZGlzYWJsZWQoKSB7IHJldHVybiB0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQoaXNEaXNhYmxlZDogYm9vbGVhbikgeyB0aGlzLnNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZCk7IH1cblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGdyb3VwLiBVbmxlc3MgZW5jbG9zZWQgaW5wdXRzIHNwZWNpZnkgYSBuYW1lLCB0aGlzIG5hbWUgaXMgdXNlZCBhcyB0aGUgbmFtZSBvZiB0aGVcbiAgICogZW5jbG9zZWQgaW5wdXRzLiBJZiBub3Qgc3BlY2lmaWVkLCBhIG5hbWUgaXMgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkuXG4gICAqL1xuICBASW5wdXQoKSBuYW1lID0gYG5nYi1yYWRpby0ke25leHRJZCsrfWA7XG5cbiAgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcbiAgb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgb25SYWRpb0NoYW5nZShyYWRpbzogTmdiUmFkaW8pIHtcbiAgICB0aGlzLndyaXRlVmFsdWUocmFkaW8udmFsdWUpO1xuICAgIHRoaXMub25DaGFuZ2UocmFkaW8udmFsdWUpO1xuICB9XG5cbiAgb25SYWRpb1ZhbHVlVXBkYXRlKCkgeyB0aGlzLl91cGRhdGVSYWRpb3NWYWx1ZSgpOyB9XG5cbiAgcmVnaXN0ZXIocmFkaW86IE5nYlJhZGlvKSB7IHRoaXMuX3JhZGlvcy5hZGQocmFkaW8pOyB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uQ2hhbmdlID0gZm47IH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gYW55KTogdm9pZCB7IHRoaXMub25Ub3VjaGVkID0gZm47IH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5fdXBkYXRlUmFkaW9zRGlzYWJsZWQoKTtcbiAgfVxuXG4gIHVucmVnaXN0ZXIocmFkaW86IE5nYlJhZGlvKSB7IHRoaXMuX3JhZGlvcy5kZWxldGUocmFkaW8pOyB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlUmFkaW9zVmFsdWUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVJhZGlvc1ZhbHVlKCkgeyB0aGlzLl9yYWRpb3MuZm9yRWFjaCgocmFkaW8pID0+IHJhZGlvLnVwZGF0ZVZhbHVlKHRoaXMuX3ZhbHVlKSk7IH1cbiAgcHJpdmF0ZSBfdXBkYXRlUmFkaW9zRGlzYWJsZWQoKSB7IHRoaXMuX3JhZGlvcy5mb3JFYWNoKChyYWRpbykgPT4gcmFkaW8udXBkYXRlRGlzYWJsZWQoKSk7IH1cbn1cblxuXG4vKipcbiAqIE1hcmtzIGFuIGlucHV0IG9mIHR5cGUgXCJyYWRpb1wiIGFzIHBhcnQgb2YgdGhlIE5nYlJhZGlvR3JvdXAuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ2JCdXR0b25dW3R5cGU9cmFkaW9dJyxcbiAgaG9zdDoge1xuICAgICdbY2hlY2tlZF0nOiAnY2hlY2tlZCcsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbbmFtZV0nOiAnbmFtZUF0dHInLFxuICAgICcoY2hhbmdlKSc6ICdvbkNoYW5nZSgpJyxcbiAgICAnKGZvY3VzKSc6ICdmb2N1c2VkID0gdHJ1ZScsXG4gICAgJyhibHVyKSc6ICdmb2N1c2VkID0gZmFsc2UnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTmdiUmFkaW8gaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9jaGVja2VkOiBib29sZWFuO1xuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfdmFsdWU6IGFueSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBpbnB1dC4gQWxsIGlucHV0cyBvZiBhIGdyb3VwIHNob3VsZCBoYXZlIHRoZSBzYW1lIG5hbWUuIElmIG5vdCBzcGVjaWZpZWQsXG4gICAqIHRoZSBuYW1lIG9mIHRoZSBlbmNsb3NpbmcgZ3JvdXAgaXMgdXNlZC5cbiAgICovXG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogWW91IGNhbiBzcGVjaWZ5IG1vZGVsIHZhbHVlIG9mIGEgZ2l2ZW4gcmFkaW8gYnkgYmluZGluZyB0byB0aGUgdmFsdWUgcHJvcGVydHkuXG4gICAqL1xuICBASW5wdXQoJ3ZhbHVlJylcbiAgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIGNvbnN0IHN0cmluZ1ZhbHVlID0gdmFsdWUgPyB2YWx1ZS50b1N0cmluZygpIDogJyc7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCBzdHJpbmdWYWx1ZSk7XG4gICAgdGhpcy5fZ3JvdXAub25SYWRpb1ZhbHVlVXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogQSBmbGFnIGluZGljYXRpbmcgaWYgYSBnaXZlbiByYWRpbyBidXR0b24gaXMgZGlzYWJsZWQuXG4gICAqL1xuICBASW5wdXQoJ2Rpc2FibGVkJylcbiAgc2V0IGRpc2FibGVkKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGlzRGlzYWJsZWQgIT09IGZhbHNlO1xuICAgIHRoaXMudXBkYXRlRGlzYWJsZWQoKTtcbiAgfVxuXG4gIHNldCBmb2N1c2VkKGlzRm9jdXNlZDogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9sYWJlbCkge1xuICAgICAgdGhpcy5fbGFiZWwuZm9jdXNlZCA9IGlzRm9jdXNlZDtcbiAgICB9XG4gICAgaWYgKCFpc0ZvY3VzZWQpIHtcbiAgICAgIHRoaXMuX2dyb3VwLm9uVG91Y2hlZCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBjaGVja2VkKCkgeyByZXR1cm4gdGhpcy5fY2hlY2tlZDsgfVxuXG4gIGdldCBkaXNhYmxlZCgpIHsgcmV0dXJuIHRoaXMuX2dyb3VwLmRpc2FibGVkIHx8IHRoaXMuX2Rpc2FibGVkOyB9XG5cbiAgZ2V0IHZhbHVlKCkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cblxuICBnZXQgbmFtZUF0dHIoKSB7IHJldHVybiB0aGlzLm5hbWUgfHwgdGhpcy5fZ3JvdXAubmFtZTsgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfZ3JvdXA6IE5nYlJhZGlvR3JvdXAsIHByaXZhdGUgX2xhYmVsOiBOZ2JCdXR0b25MYWJlbCwgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4pIHtcbiAgICB0aGlzLl9ncm91cC5yZWdpc3Rlcih0aGlzKTtcbiAgICB0aGlzLnVwZGF0ZURpc2FibGVkKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHsgdGhpcy5fZ3JvdXAudW5yZWdpc3Rlcih0aGlzKTsgfVxuXG4gIG9uQ2hhbmdlKCkgeyB0aGlzLl9ncm91cC5vblJhZGlvQ2hhbmdlKHRoaXMpOyB9XG5cbiAgdXBkYXRlVmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLl9jaGVja2VkID0gdGhpcy52YWx1ZSA9PT0gdmFsdWU7XG4gICAgdGhpcy5fbGFiZWwuYWN0aXZlID0gdGhpcy5fY2hlY2tlZDtcbiAgfVxuXG4gIHVwZGF0ZURpc2FibGVkKCkgeyB0aGlzLl9sYWJlbC5kaXNhYmxlZCA9IHRoaXMuZGlzYWJsZWQ7IH1cbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JCdXR0b25MYWJlbH0gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge05nYkNoZWNrQm94fSBmcm9tICcuL2NoZWNrYm94JztcbmltcG9ydCB7TmdiUmFkaW8sIE5nYlJhZGlvR3JvdXB9IGZyb20gJy4vcmFkaW8nO1xuXG5leHBvcnQge05nYkJ1dHRvbkxhYmVsfSBmcm9tICcuL2xhYmVsJztcbmV4cG9ydCB7TmdiQ2hlY2tCb3h9IGZyb20gJy4vY2hlY2tib3gnO1xuZXhwb3J0IHtOZ2JSYWRpbywgTmdiUmFkaW9Hcm91cH0gZnJvbSAnLi9yYWRpbyc7XG5cblxuY29uc3QgTkdCX0JVVFRPTl9ESVJFQ1RJVkVTID0gW05nYkJ1dHRvbkxhYmVsLCBOZ2JDaGVja0JveCwgTmdiUmFkaW9Hcm91cCwgTmdiUmFkaW9dO1xuXG5ATmdNb2R1bGUoe2RlY2xhcmF0aW9uczogTkdCX0JVVFRPTl9ESVJFQ1RJVkVTLCBleHBvcnRzOiBOR0JfQlVUVE9OX0RJUkVDVElWRVN9KVxuZXhwb3J0IGNsYXNzIE5nYkJ1dHRvbnNNb2R1bGUge1xuICAvKipcbiAgICogSW1wb3J0aW5nIHdpdGggJy5mb3JSb290KCknIGlzIG5vIGxvbmdlciBuZWNlc3NhcnksIHlvdSBjYW4gc2ltcGx5IGltcG9ydCB0aGUgbW9kdWxlLlxuICAgKiBXaWxsIGJlIHJlbW92ZWQgaW4gNC4wLjAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiQnV0dG9uc01vZHVsZX07IH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBzZXJ2aWNlIGZvciB0aGUgTmdiQ2Fyb3VzZWwgY29tcG9uZW50LlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIGNhcm91c2VscyB1c2VkIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiQ2Fyb3VzZWxDb25maWcge1xuICBpbnRlcnZhbCA9IDUwMDA7XG4gIHdyYXAgPSB0cnVlO1xuICBrZXlib2FyZCA9IHRydWU7XG4gIHBhdXNlT25Ib3ZlciA9IHRydWU7XG4gIHNob3dOYXZpZ2F0aW9uQXJyb3dzID0gdHJ1ZTtcbiAgc2hvd05hdmlnYXRpb25JbmRpY2F0b3JzID0gdHJ1ZTtcbn1cbiIsImltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFBMQVRGT1JNX0lELFxuICBRdWVyeUxpc3QsXG4gIFRlbXBsYXRlUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHtOZ2JDYXJvdXNlbENvbmZpZ30gZnJvbSAnLi9jYXJvdXNlbC1jb25maWcnO1xuXG5pbXBvcnQge1N1YmplY3QsIHRpbWVyfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCBtYXAsIHN3aXRjaE1hcCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmxldCBuZXh0SWQgPSAwO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gaW5kaXZpZHVhbCBzbGlkZSB0byBiZSB1c2VkIHdpdGhpbiBhIGNhcm91c2VsLlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYlNsaWRlXSd9KVxuZXhwb3J0IGNsYXNzIE5nYlNsaWRlIHtcbiAgLyoqXG4gICAqIFVuaXF1ZSBzbGlkZSBpZGVudGlmaWVyLiBNdXN0IGJlIHVuaXF1ZSBmb3IgdGhlIGVudGlyZSBkb2N1bWVudCBmb3IgcHJvcGVyIGFjY2Vzc2liaWxpdHkgc3VwcG9ydC5cbiAgICogV2lsbCBiZSBhdXRvLWdlbmVyYXRlZCBpZiBub3QgcHJvdmlkZWQuXG4gICAqL1xuICBASW5wdXQoKSBpZCA9IGBuZ2Itc2xpZGUtJHtuZXh0SWQrK31gO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdHBsUmVmOiBUZW1wbGF0ZVJlZjxhbnk+KSB7fVxufVxuXG4vKipcbiAqIERpcmVjdGl2ZSB0byBlYXNpbHkgY3JlYXRlIGNhcm91c2VscyBiYXNlZCBvbiBCb290c3RyYXAncyBtYXJrdXAuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1jYXJvdXNlbCcsXG4gIGV4cG9ydEFzOiAnbmdiQ2Fyb3VzZWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdjYXJvdXNlbCBzbGlkZScsXG4gICAgJ1tzdHlsZS5kaXNwbGF5XSc6ICdcImJsb2NrXCInLFxuICAgICd0YWJJbmRleCc6ICcwJyxcbiAgICAnKG1vdXNlZW50ZXIpJzogJ3BhdXNlT25Ib3ZlciAmJiBwYXVzZSgpJyxcbiAgICAnKG1vdXNlbGVhdmUpJzogJ3BhdXNlT25Ib3ZlciAmJiBjeWNsZSgpJyxcbiAgICAnKGtleWRvd24uYXJyb3dMZWZ0KSc6ICdrZXlib2FyZCAmJiBwcmV2KCknLFxuICAgICcoa2V5ZG93bi5hcnJvd1JpZ2h0KSc6ICdrZXlib2FyZCAmJiBuZXh0KCknXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPG9sIGNsYXNzPVwiY2Fyb3VzZWwtaW5kaWNhdG9yc1wiICpuZ0lmPVwic2hvd05hdmlnYXRpb25JbmRpY2F0b3JzXCI+XG4gICAgICA8bGkgKm5nRm9yPVwibGV0IHNsaWRlIG9mIHNsaWRlc1wiIFtpZF09XCJzbGlkZS5pZFwiIFtjbGFzcy5hY3RpdmVdPVwic2xpZGUuaWQgPT09IGFjdGl2ZUlkXCJcbiAgICAgICAgICAoY2xpY2spPVwic2VsZWN0KHNsaWRlLmlkKTsgcGF1c2VPbkhvdmVyICYmIHBhdXNlKClcIj48L2xpPlxuICAgIDwvb2w+XG4gICAgPGRpdiBjbGFzcz1cImNhcm91c2VsLWlubmVyXCI+XG4gICAgICA8ZGl2ICpuZ0Zvcj1cImxldCBzbGlkZSBvZiBzbGlkZXNcIiBjbGFzcz1cImNhcm91c2VsLWl0ZW1cIiBbY2xhc3MuYWN0aXZlXT1cInNsaWRlLmlkID09PSBhY3RpdmVJZFwiPlxuICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwic2xpZGUudHBsUmVmXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxhIGNsYXNzPVwiY2Fyb3VzZWwtY29udHJvbC1wcmV2XCIgcm9sZT1cImJ1dHRvblwiIChjbGljayk9XCJwcmV2KClcIiAqbmdJZj1cInNob3dOYXZpZ2F0aW9uQXJyb3dzXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cImNhcm91c2VsLWNvbnRyb2wtcHJldi1pY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCIgaTE4bj1cIkBAbmdiLmNhcm91c2VsLnByZXZpb3VzXCI+UHJldmlvdXM8L3NwYW4+XG4gICAgPC9hPlxuICAgIDxhIGNsYXNzPVwiY2Fyb3VzZWwtY29udHJvbC1uZXh0XCIgcm9sZT1cImJ1dHRvblwiIChjbGljayk9XCJuZXh0KClcIiAqbmdJZj1cInNob3dOYXZpZ2F0aW9uQXJyb3dzXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cImNhcm91c2VsLWNvbnRyb2wtbmV4dC1pY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCIgaTE4bj1cIkBAbmdiLmNhcm91c2VsLm5leHRcIj5OZXh0PC9zcGFuPlxuICAgIDwvYT5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JDYXJvdXNlbCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudENoZWNrZWQsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBAQ29udGVudENoaWxkcmVuKE5nYlNsaWRlKSBzbGlkZXM6IFF1ZXJ5TGlzdDxOZ2JTbGlkZT47XG5cbiAgcHJpdmF0ZSBfc3RhcnQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBfc3RvcCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaGUgYWN0aXZlIHNsaWRlIGlkLlxuICAgKi9cbiAgQElucHV0KCkgYWN0aXZlSWQ6IHN0cmluZztcblxuXG4gIC8qKlxuICAgKiBBbW91bnQgb2YgdGltZSBpbiBtaWxsaXNlY29uZHMgYmVmb3JlIG5leHQgc2xpZGUgaXMgc2hvd24uXG4gICAqL1xuICBASW5wdXQoKSBpbnRlcnZhbDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGNhbiB3cmFwIGZyb20gdGhlIGxhc3QgdG8gdGhlIGZpcnN0IHNsaWRlLlxuICAgKi9cbiAgQElucHV0KCkgd3JhcDogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBmbGFnIGZvciBhbGxvd2luZyBuYXZpZ2F0aW9uIHZpYSBrZXlib2FyZFxuICAgKi9cbiAgQElucHV0KCkga2V5Ym9hcmQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgZmxhZyB0byBlbmFibGUgc2xpZGUgY3ljbGluZyBwYXVzZS9yZXN1bWUgb24gbW91c2VvdmVyLlxuICAgKiBAc2luY2UgMi4yLjBcbiAgICovXG4gIEBJbnB1dCgpIHBhdXNlT25Ib3ZlcjogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBmbGFnIHRvIHNob3cgLyBoaWRlIG5hdmlnYXRpb24gYXJyb3dzLlxuICAgKiBAc2luY2UgMi4yLjBcbiAgICovXG4gIEBJbnB1dCgpIHNob3dOYXZpZ2F0aW9uQXJyb3dzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgdG8gc2hvdyAvIGhpZGUgbmF2aWdhdGlvbiBpbmRpY2F0b3JzLlxuICAgKiBAc2luY2UgMi4yLjBcbiAgICovXG4gIEBJbnB1dCgpIHNob3dOYXZpZ2F0aW9uSW5kaWNhdG9yczogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBjYXJvdXNlbCBzbGlkZSBldmVudCBmaXJlZCB3aGVuIHRoZSBzbGlkZSB0cmFuc2l0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICogU2VlIE5nYlNsaWRlRXZlbnQgZm9yIHBheWxvYWQgZGV0YWlsc1xuICAgKi9cbiAgQE91dHB1dCgpIHNsaWRlID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JTbGlkZUV2ZW50PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgY29uZmlnOiBOZ2JDYXJvdXNlbENvbmZpZywgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBfcGxhdGZvcm1JZCwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICBwcml2YXRlIF9jZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICB0aGlzLmludGVydmFsID0gY29uZmlnLmludGVydmFsO1xuICAgIHRoaXMud3JhcCA9IGNvbmZpZy53cmFwO1xuICAgIHRoaXMua2V5Ym9hcmQgPSBjb25maWcua2V5Ym9hcmQ7XG4gICAgdGhpcy5wYXVzZU9uSG92ZXIgPSBjb25maWcucGF1c2VPbkhvdmVyO1xuICAgIHRoaXMuc2hvd05hdmlnYXRpb25BcnJvd3MgPSBjb25maWcuc2hvd05hdmlnYXRpb25BcnJvd3M7XG4gICAgdGhpcy5zaG93TmF2aWdhdGlvbkluZGljYXRvcnMgPSBjb25maWcuc2hvd05hdmlnYXRpb25JbmRpY2F0b3JzO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIC8vIHNldEludGVydmFsKCkgZG9lc24ndCBwbGF5IHdlbGwgd2l0aCBTU1IgYW5kIHByb3RyYWN0b3IsXG4gICAgLy8gc28gd2Ugc2hvdWxkIHJ1biBpdCBpbiB0aGUgYnJvd3NlciBhbmQgb3V0c2lkZSBBbmd1bGFyXG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuX3BsYXRmb3JtSWQpKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLl9zdGFydCRcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgoKSA9PiB0aGlzLmludGVydmFsKSwgZmlsdGVyKGludGVydmFsID0+IGludGVydmFsID4gMCAmJiB0aGlzLnNsaWRlcy5sZW5ndGggPiAwKSxcbiAgICAgICAgICAgICAgICBzd2l0Y2hNYXAoaW50ZXJ2YWwgPT4gdGltZXIoaW50ZXJ2YWwpLnBpcGUodGFrZVVudGlsKHRoaXMuX3N0b3AkKSkpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMubmV4dCgpKSk7XG5cbiAgICAgICAgdGhpcy5fc3RhcnQkLm5leHQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICBsZXQgYWN0aXZlU2xpZGUgPSB0aGlzLl9nZXRTbGlkZUJ5SWQodGhpcy5hY3RpdmVJZCk7XG4gICAgdGhpcy5hY3RpdmVJZCA9IGFjdGl2ZVNsaWRlID8gYWN0aXZlU2xpZGUuaWQgOiAodGhpcy5zbGlkZXMubGVuZ3RoID8gdGhpcy5zbGlkZXMuZmlyc3QuaWQgOiBudWxsKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkgeyB0aGlzLl9zdG9wJC5uZXh0KCk7IH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XG4gICAgaWYgKCdpbnRlcnZhbCcgaW4gY2hhbmdlcyAmJiAhY2hhbmdlc1snaW50ZXJ2YWwnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMuX3N0YXJ0JC5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlIHRvIGEgc2xpZGUgd2l0aCB0aGUgc3BlY2lmaWVkIGlkZW50aWZpZXIuXG4gICAqL1xuICBzZWxlY3Qoc2xpZGVJZDogc3RyaW5nKSB7IHRoaXMuX2N5Y2xlVG9TZWxlY3RlZChzbGlkZUlkLCB0aGlzLl9nZXRTbGlkZUV2ZW50RGlyZWN0aW9uKHRoaXMuYWN0aXZlSWQsIHNsaWRlSWQpKTsgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZSB0byB0aGUgbmV4dCBzbGlkZS5cbiAgICovXG4gIHByZXYoKSB7IHRoaXMuX2N5Y2xlVG9TZWxlY3RlZCh0aGlzLl9nZXRQcmV2U2xpZGUodGhpcy5hY3RpdmVJZCksIE5nYlNsaWRlRXZlbnREaXJlY3Rpb24uUklHSFQpOyB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlIHRvIHRoZSBuZXh0IHNsaWRlLlxuICAgKi9cbiAgbmV4dCgpIHsgdGhpcy5fY3ljbGVUb1NlbGVjdGVkKHRoaXMuX2dldE5leHRTbGlkZSh0aGlzLmFjdGl2ZUlkKSwgTmdiU2xpZGVFdmVudERpcmVjdGlvbi5MRUZUKTsgfVxuXG4gIC8qKlxuICAgKiBTdG9wcyB0aGUgY2Fyb3VzZWwgZnJvbSBjeWNsaW5nIHRocm91Z2ggaXRlbXMuXG4gICAqL1xuICBwYXVzZSgpIHsgdGhpcy5fc3RvcCQubmV4dCgpOyB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnRzIGN5Y2xpbmcgdGhyb3VnaCB0aGUgY2Fyb3VzZWwgc2xpZGVzIGZyb20gbGVmdCB0byByaWdodC5cbiAgICovXG4gIGN5Y2xlKCkgeyB0aGlzLl9zdGFydCQubmV4dCgpOyB9XG5cbiAgcHJpdmF0ZSBfY3ljbGVUb1NlbGVjdGVkKHNsaWRlSWR4OiBzdHJpbmcsIGRpcmVjdGlvbjogTmdiU2xpZGVFdmVudERpcmVjdGlvbikge1xuICAgIGxldCBzZWxlY3RlZFNsaWRlID0gdGhpcy5fZ2V0U2xpZGVCeUlkKHNsaWRlSWR4KTtcbiAgICBpZiAoc2VsZWN0ZWRTbGlkZSAmJiBzZWxlY3RlZFNsaWRlLmlkICE9PSB0aGlzLmFjdGl2ZUlkKSB7XG4gICAgICB0aGlzLnNsaWRlLmVtaXQoe3ByZXY6IHRoaXMuYWN0aXZlSWQsIGN1cnJlbnQ6IHNlbGVjdGVkU2xpZGUuaWQsIGRpcmVjdGlvbjogZGlyZWN0aW9ufSk7XG4gICAgICB0aGlzLl9zdGFydCQubmV4dCgpO1xuICAgICAgdGhpcy5hY3RpdmVJZCA9IHNlbGVjdGVkU2xpZGUuaWQ7XG4gICAgfVxuXG4gICAgLy8gd2UgZ2V0IGhlcmUgYWZ0ZXIgdGhlIGludGVydmFsIGZpcmVzIG9yIGFueSBleHRlcm5hbCBBUEkgY2FsbCBsaWtlIG5leHQoKSwgcHJldigpIG9yIHNlbGVjdCgpXG4gICAgdGhpcy5fY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRTbGlkZUV2ZW50RGlyZWN0aW9uKGN1cnJlbnRBY3RpdmVTbGlkZUlkOiBzdHJpbmcsIG5leHRBY3RpdmVTbGlkZUlkOiBzdHJpbmcpOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uIHtcbiAgICBjb25zdCBjdXJyZW50QWN0aXZlU2xpZGVJZHggPSB0aGlzLl9nZXRTbGlkZUlkeEJ5SWQoY3VycmVudEFjdGl2ZVNsaWRlSWQpO1xuICAgIGNvbnN0IG5leHRBY3RpdmVTbGlkZUlkeCA9IHRoaXMuX2dldFNsaWRlSWR4QnlJZChuZXh0QWN0aXZlU2xpZGVJZCk7XG5cbiAgICByZXR1cm4gY3VycmVudEFjdGl2ZVNsaWRlSWR4ID4gbmV4dEFjdGl2ZVNsaWRlSWR4ID8gTmdiU2xpZGVFdmVudERpcmVjdGlvbi5SSUdIVCA6IE5nYlNsaWRlRXZlbnREaXJlY3Rpb24uTEVGVDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFNsaWRlQnlJZChzbGlkZUlkOiBzdHJpbmcpOiBOZ2JTbGlkZSB7IHJldHVybiB0aGlzLnNsaWRlcy5maW5kKHNsaWRlID0+IHNsaWRlLmlkID09PSBzbGlkZUlkKTsgfVxuXG4gIHByaXZhdGUgX2dldFNsaWRlSWR4QnlJZChzbGlkZUlkOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnNsaWRlcy50b0FycmF5KCkuaW5kZXhPZih0aGlzLl9nZXRTbGlkZUJ5SWQoc2xpZGVJZCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0TmV4dFNsaWRlKGN1cnJlbnRTbGlkZUlkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHNsaWRlQXJyID0gdGhpcy5zbGlkZXMudG9BcnJheSgpO1xuICAgIGNvbnN0IGN1cnJlbnRTbGlkZUlkeCA9IHRoaXMuX2dldFNsaWRlSWR4QnlJZChjdXJyZW50U2xpZGVJZCk7XG4gICAgY29uc3QgaXNMYXN0U2xpZGUgPSBjdXJyZW50U2xpZGVJZHggPT09IHNsaWRlQXJyLmxlbmd0aCAtIDE7XG5cbiAgICByZXR1cm4gaXNMYXN0U2xpZGUgPyAodGhpcy53cmFwID8gc2xpZGVBcnJbMF0uaWQgOiBzbGlkZUFycltzbGlkZUFyci5sZW5ndGggLSAxXS5pZCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlQXJyW2N1cnJlbnRTbGlkZUlkeCArIDFdLmlkO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UHJldlNsaWRlKGN1cnJlbnRTbGlkZUlkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHNsaWRlQXJyID0gdGhpcy5zbGlkZXMudG9BcnJheSgpO1xuICAgIGNvbnN0IGN1cnJlbnRTbGlkZUlkeCA9IHRoaXMuX2dldFNsaWRlSWR4QnlJZChjdXJyZW50U2xpZGVJZCk7XG4gICAgY29uc3QgaXNGaXJzdFNsaWRlID0gY3VycmVudFNsaWRlSWR4ID09PSAwO1xuXG4gICAgcmV0dXJuIGlzRmlyc3RTbGlkZSA/ICh0aGlzLndyYXAgPyBzbGlkZUFycltzbGlkZUFyci5sZW5ndGggLSAxXS5pZCA6IHNsaWRlQXJyWzBdLmlkKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlQXJyW2N1cnJlbnRTbGlkZUlkeCAtIDFdLmlkO1xuICB9XG59XG5cbi8qKlxuICogVGhlIHBheWxvYWQgb2YgdGhlIHNsaWRlIGV2ZW50IGZpcmVkIHdoZW4gdGhlIHNsaWRlIHRyYW5zaXRpb24gaXMgY29tcGxldGVkXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiU2xpZGVFdmVudCB7XG4gIC8qKlxuICAgKiBQcmV2aW91cyBzbGlkZSBpZFxuICAgKi9cbiAgcHJldjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOZXcgc2xpZGUgaWRzXG4gICAqL1xuICBjdXJyZW50OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNsaWRlIGV2ZW50IGRpcmVjdGlvblxuICAgKi9cbiAgZGlyZWN0aW9uOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uO1xufVxuXG4vKipcbiAqIEVudW0gdG8gZGVmaW5lIHRoZSBjYXJvdXNlbCBzbGlkZSBldmVudCBkaXJlY3Rpb25cbiAqL1xuZXhwb3J0IGVudW0gTmdiU2xpZGVFdmVudERpcmVjdGlvbiB7XG4gIExFRlQgPSA8YW55PidsZWZ0JyxcbiAgUklHSFQgPSA8YW55PidyaWdodCdcbn1cblxuZXhwb3J0IGNvbnN0IE5HQl9DQVJPVVNFTF9ESVJFQ1RJVkVTID0gW05nYkNhcm91c2VsLCBOZ2JTbGlkZV07XG4iLCJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge05HQl9DQVJPVVNFTF9ESVJFQ1RJVkVTfSBmcm9tICcuL2Nhcm91c2VsJztcblxuZXhwb3J0IHtOZ2JDYXJvdXNlbCwgTmdiU2xpZGUsIE5nYlNsaWRlRXZlbnR9IGZyb20gJy4vY2Fyb3VzZWwnO1xuZXhwb3J0IHtOZ2JDYXJvdXNlbENvbmZpZ30gZnJvbSAnLi9jYXJvdXNlbC1jb25maWcnO1xuXG5ATmdNb2R1bGUoe2RlY2xhcmF0aW9uczogTkdCX0NBUk9VU0VMX0RJUkVDVElWRVMsIGV4cG9ydHM6IE5HQl9DQVJPVVNFTF9ESVJFQ1RJVkVTLCBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXX0pXG5leHBvcnQgY2xhc3MgTmdiQ2Fyb3VzZWxNb2R1bGUge1xuICAvKipcbiAgICogSW1wb3J0aW5nIHdpdGggJy5mb3JSb290KCknIGlzIG5vIGxvbmdlciBuZWNlc3NhcnksIHlvdSBjYW4gc2ltcGx5IGltcG9ydCB0aGUgbW9kdWxlLlxuICAgKiBXaWxsIGJlIHJlbW92ZWQgaW4gNC4wLjAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiQ2Fyb3VzZWxNb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIFRoZSBOZ2JDb2xsYXBzZSBkaXJlY3RpdmUgcHJvdmlkZXMgYSBzaW1wbGUgd2F5IHRvIGhpZGUgYW5kIHNob3cgYW4gZWxlbWVudCB3aXRoIGFuaW1hdGlvbnMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ2JDb2xsYXBzZV0nLFxuICBleHBvcnRBczogJ25nYkNvbGxhcHNlJyxcbiAgaG9zdDogeydbY2xhc3MuY29sbGFwc2VdJzogJ3RydWUnLCAnW2NsYXNzLnNob3ddJzogJyFjb2xsYXBzZWQnfVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JDb2xsYXBzZSB7XG4gIC8qKlxuICAgKiBBIGZsYWcgaW5kaWNhdGluZyBjb2xsYXBzZWQgKHRydWUpIG9yIG9wZW4gKGZhbHNlKSBzdGF0ZS5cbiAgICovXG4gIEBJbnB1dCgnbmdiQ29sbGFwc2UnKSBjb2xsYXBzZWQgPSBmYWxzZTtcbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JDb2xsYXBzZX0gZnJvbSAnLi9jb2xsYXBzZSc7XG5cbmV4cG9ydCB7TmdiQ29sbGFwc2V9IGZyb20gJy4vY29sbGFwc2UnO1xuXG5ATmdNb2R1bGUoe2RlY2xhcmF0aW9uczogW05nYkNvbGxhcHNlXSwgZXhwb3J0czogW05nYkNvbGxhcHNlXX0pXG5leHBvcnQgY2xhc3MgTmdiQ29sbGFwc2VNb2R1bGUge1xuICAvKipcbiAgICogSW1wb3J0aW5nIHdpdGggJy5mb3JSb290KCknIGlzIG5vIGxvbmdlciBuZWNlc3NhcnksIHlvdSBjYW4gc2ltcGx5IGltcG9ydCB0aGUgbW9kdWxlLlxuICAgKiBXaWxsIGJlIHJlbW92ZWQgaW4gNC4wLjAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiQ29sbGFwc2VNb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcbmltcG9ydCB7aXNJbnRlZ2VyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG4vKipcbiAqIFNpbXBsZSBjbGFzcyB1c2VkIGZvciBhIGRhdGUgcmVwcmVzZW50YXRpb24gdGhhdCBkYXRlcGlja2VyIGFsc28gdXNlcyBpbnRlcm5hbGx5XG4gKlxuICogQHNpbmNlIDMuMC4wXG4gKi9cbmV4cG9ydCBjbGFzcyBOZ2JEYXRlIGltcGxlbWVudHMgTmdiRGF0ZVN0cnVjdCB7XG4gIC8qKlxuICAgKiBUaGUgeWVhciwgZm9yIGV4YW1wbGUgMjAxNlxuICAgKi9cbiAgeWVhcjogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbW9udGgsIGZvciBleGFtcGxlIDE9SmFuIC4uLiAxMj1EZWMgYXMgaW4gSVNPIDg2MDFcbiAgICovXG4gIG1vbnRoOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXkgb2YgbW9udGgsIHN0YXJ0aW5nIHdpdGggMVxuICAgKi9cbiAgZGF5OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFN0YXRpYyBtZXRob2QuIENyZWF0ZXMgYSBuZXcgZGF0ZSBvYmplY3QgZnJvbSB0aGUgTmdiRGF0ZVN0cnVjdCwgZXguIE5nYkRhdGUuZnJvbSh7eWVhcjogMjAwMCxcbiAgICogbW9udGg6IDUsIGRheTogMX0pLiBJZiB0aGUgJ2RhdGUnIGlzIGFscmVhZHkgb2YgTmdiRGF0ZSwgdGhlIG1ldGhvZCB3aWxsIHJldHVybiB0aGUgc2FtZSBvYmplY3RcbiAgICovXG4gIHN0YXRpYyBmcm9tKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBOZ2JEYXRlIHtcbiAgICBpZiAoZGF0ZSBpbnN0YW5jZW9mIE5nYkRhdGUpIHtcbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgICByZXR1cm4gZGF0ZSA/IG5ldyBOZ2JEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCwgZGF0ZS5kYXkpIDogbnVsbDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlciwgZGF5OiBudW1iZXIpIHtcbiAgICB0aGlzLnllYXIgPSBpc0ludGVnZXIoeWVhcikgPyB5ZWFyIDogbnVsbDtcbiAgICB0aGlzLm1vbnRoID0gaXNJbnRlZ2VyKG1vbnRoKSA/IG1vbnRoIDogbnVsbDtcbiAgICB0aGlzLmRheSA9IGlzSW50ZWdlcihkYXkpID8gZGF5IDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgY3VycmVudCBkYXRlIGlzIGVxdWFsIHRvIGFub3RoZXIgZGF0ZVxuICAgKi9cbiAgZXF1YWxzKG90aGVyOiBOZ2JEYXRlU3RydWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG90aGVyICYmIHRoaXMueWVhciA9PT0gb3RoZXIueWVhciAmJiB0aGlzLm1vbnRoID09PSBvdGhlci5tb250aCAmJiB0aGlzLmRheSA9PT0gb3RoZXIuZGF5O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBjdXJyZW50IGRhdGUgaXMgYmVmb3JlIGFub3RoZXIgZGF0ZVxuICAgKi9cbiAgYmVmb3JlKG90aGVyOiBOZ2JEYXRlU3RydWN0KTogYm9vbGVhbiB7XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnllYXIgPT09IG90aGVyLnllYXIpIHtcbiAgICAgIGlmICh0aGlzLm1vbnRoID09PSBvdGhlci5tb250aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXkgPT09IG90aGVyLmRheSA/IGZhbHNlIDogdGhpcy5kYXkgPCBvdGhlci5kYXk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5tb250aCA8IG90aGVyLm1vbnRoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy55ZWFyIDwgb3RoZXIueWVhcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGN1cnJlbnQgZGF0ZSBpcyBhZnRlciBhbm90aGVyIGRhdGVcbiAgICovXG4gIGFmdGVyKG90aGVyOiBOZ2JEYXRlU3RydWN0KTogYm9vbGVhbiB7XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGhpcy55ZWFyID09PSBvdGhlci55ZWFyKSB7XG4gICAgICBpZiAodGhpcy5tb250aCA9PT0gb3RoZXIubW9udGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF5ID09PSBvdGhlci5kYXkgPyBmYWxzZSA6IHRoaXMuZGF5ID4gb3RoZXIuZGF5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9udGggPiBvdGhlci5tb250aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMueWVhciA+IG90aGVyLnllYXI7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge05nYkRhdGV9IGZyb20gJy4vbmdiLWRhdGUnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7aXNJbnRlZ2VyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUpTRGF0ZShqc0RhdGU6IERhdGUpIHtcbiAgcmV0dXJuIG5ldyBOZ2JEYXRlKGpzRGF0ZS5nZXRGdWxsWWVhcigpLCBqc0RhdGUuZ2V0TW9udGgoKSArIDEsIGpzRGF0ZS5nZXREYXRlKCkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvSlNEYXRlKGRhdGU6IE5nYkRhdGUpIHtcbiAgY29uc3QganNEYXRlID0gbmV3IERhdGUoZGF0ZS55ZWFyLCBkYXRlLm1vbnRoIC0gMSwgZGF0ZS5kYXksIDEyKTtcbiAgLy8gdGhpcyBpcyBkb25lIGF2b2lkIDMwIC0+IDE5MzAgY29udmVyc2lvblxuICBpZiAoIWlzTmFOKGpzRGF0ZS5nZXRUaW1lKCkpKSB7XG4gICAganNEYXRlLnNldEZ1bGxZZWFyKGRhdGUueWVhcik7XG4gIH1cbiAgcmV0dXJuIGpzRGF0ZTtcbn1cblxuZXhwb3J0IHR5cGUgTmdiUGVyaW9kID0gJ3knIHwgJ20nIHwgJ2QnO1xuXG5leHBvcnQgZnVuY3Rpb24gTkdCX0RBVEVQSUNLRVJfQ0FMRU5EQVJfRkFDVE9SWSgpIHtcbiAgcmV0dXJuIG5ldyBOZ2JDYWxlbmRhckdyZWdvcmlhbigpO1xufVxuXG4vKipcbiAqIENhbGVuZGFyIHVzZWQgYnkgdGhlIGRhdGVwaWNrZXIuXG4gKiBEZWZhdWx0IGltcGxlbWVudGF0aW9uIHVzZXMgR3JlZ29yaWFuIGNhbGVuZGFyLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnLCB1c2VGYWN0b3J5OiBOR0JfREFURVBJQ0tFUl9DQUxFTkRBUl9GQUNUT1JZfSlcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOZ2JDYWxlbmRhciB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIG51bWJlciBvZiBkYXlzIHBlciB3ZWVrLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0RGF5c1BlcldlZWsoKTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIG1vbnRocyBwZXIgeWVhci5cbiAgICogV2l0aCBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMSBhbmQgcmV0dXJuIFsxLCAyLCAuLi4sIDEyXTtcbiAgICovXG4gIGFic3RyYWN0IGdldE1vbnRocyh5ZWFyPzogbnVtYmVyKTogbnVtYmVyW107XG5cbiAgLyoqXG4gICAqIFJldHVybnMgbnVtYmVyIG9mIHdlZWtzIHBlciBtb250aC5cbiAgICovXG4gIGFic3RyYWN0IGdldFdlZWtzUGVyTW9udGgoKTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdlZWtkYXkgbnVtYmVyIGZvciBhIGdpdmVuIGRheS5cbiAgICogV2l0aCBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMTogJ3dlZWtkYXknIGlzIDE9TW9uIC4uLiA3PVN1blxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0V2Vla2RheShkYXRlOiBOZ2JEYXRlKTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgbnVtYmVyIG9mIHllYXJzLCBtb250aHMgb3IgZGF5cyB0byBhIGdpdmVuIGRhdGUuXG4gICAqIFBlcmlvZCBjYW4gYmUgJ3knLCAnbScgb3IgJ2QnIGFuZCBkZWZhdWx0cyB0byBkYXkuXG4gICAqIE51bWJlciBkZWZhdWx0cyB0byAxLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0TmV4dChkYXRlOiBOZ2JEYXRlLCBwZXJpb2Q/OiBOZ2JQZXJpb2QsIG51bWJlcj86IG51bWJlcik6IE5nYkRhdGU7XG5cbiAgLyoqXG4gICAqIFN1YnRyYWN0cyBhIG51bWJlciBvZiB5ZWFycywgbW9udGhzIG9yIGRheXMgZnJvbSBhIGdpdmVuIGRhdGUuXG4gICAqIFBlcmlvZCBjYW4gYmUgJ3knLCAnbScgb3IgJ2QnIGFuZCBkZWZhdWx0cyB0byBkYXkuXG4gICAqIE51bWJlciBkZWZhdWx0cyB0byAxLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0UHJldihkYXRlOiBOZ2JEYXRlLCBwZXJpb2Q/OiBOZ2JQZXJpb2QsIG51bWJlcj86IG51bWJlcik6IE5nYkRhdGU7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2VlayBudW1iZXIgZm9yIGEgZ2l2ZW4gd2Vlay5cbiAgICovXG4gIGFic3RyYWN0IGdldFdlZWtOdW1iZXIod2VlazogTmdiRGF0ZVtdLCBmaXJzdERheU9mV2VlazogbnVtYmVyKTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRvZGF5J3MgZGF0ZS5cbiAgICovXG4gIGFic3RyYWN0IGdldFRvZGF5KCk6IE5nYkRhdGU7XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIGRhdGUgaXMgdmFsaWQgZm9yIGEgY3VycmVudCBjYWxlbmRhci5cbiAgICovXG4gIGFic3RyYWN0IGlzVmFsaWQoZGF0ZTogTmdiRGF0ZSk6IGJvb2xlYW47XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JDYWxlbmRhckdyZWdvcmlhbiBleHRlbmRzIE5nYkNhbGVuZGFyIHtcbiAgZ2V0RGF5c1BlcldlZWsoKSB7IHJldHVybiA3OyB9XG5cbiAgZ2V0TW9udGhzKCkgeyByZXR1cm4gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTJdOyB9XG5cbiAgZ2V0V2Vla3NQZXJNb250aCgpIHsgcmV0dXJuIDY7IH1cblxuICBnZXROZXh0KGRhdGU6IE5nYkRhdGUsIHBlcmlvZDogTmdiUGVyaW9kID0gJ2QnLCBudW1iZXIgPSAxKSB7XG4gICAgbGV0IGpzRGF0ZSA9IHRvSlNEYXRlKGRhdGUpO1xuXG4gICAgc3dpdGNoIChwZXJpb2QpIHtcbiAgICAgIGNhc2UgJ3knOlxuICAgICAgICByZXR1cm4gbmV3IE5nYkRhdGUoZGF0ZS55ZWFyICsgbnVtYmVyLCAxLCAxKTtcbiAgICAgIGNhc2UgJ20nOlxuICAgICAgICBqc0RhdGUgPSBuZXcgRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGggKyBudW1iZXIgLSAxLCAxLCAxMik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZCc6XG4gICAgICAgIGpzRGF0ZS5zZXREYXRlKGpzRGF0ZS5nZXREYXRlKCkgKyBudW1iZXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIHJldHVybiBmcm9tSlNEYXRlKGpzRGF0ZSk7XG4gIH1cblxuICBnZXRQcmV2KGRhdGU6IE5nYkRhdGUsIHBlcmlvZDogTmdiUGVyaW9kID0gJ2QnLCBudW1iZXIgPSAxKSB7IHJldHVybiB0aGlzLmdldE5leHQoZGF0ZSwgcGVyaW9kLCAtbnVtYmVyKTsgfVxuXG4gIGdldFdlZWtkYXkoZGF0ZTogTmdiRGF0ZSkge1xuICAgIGxldCBqc0RhdGUgPSB0b0pTRGF0ZShkYXRlKTtcbiAgICBsZXQgZGF5ID0ganNEYXRlLmdldERheSgpO1xuICAgIC8vIGluIEpTIERhdGUgU3VuPTAsIGluIElTTyA4NjAxIFN1bj03XG4gICAgcmV0dXJuIGRheSA9PT0gMCA/IDcgOiBkYXk7XG4gIH1cblxuICBnZXRXZWVrTnVtYmVyKHdlZWs6IE5nYkRhdGVbXSwgZmlyc3REYXlPZldlZWs6IG51bWJlcikge1xuICAgIC8vIGluIEpTIERhdGUgU3VuPTAsIGluIElTTyA4NjAxIFN1bj03XG4gICAgaWYgKGZpcnN0RGF5T2ZXZWVrID09PSA3KSB7XG4gICAgICBmaXJzdERheU9mV2VlayA9IDA7XG4gICAgfVxuXG4gICAgY29uc3QgdGh1cnNkYXlJbmRleCA9ICg0ICsgNyAtIGZpcnN0RGF5T2ZXZWVrKSAlIDc7XG4gICAgbGV0IGRhdGUgPSB3ZWVrW3RodXJzZGF5SW5kZXhdO1xuXG4gICAgY29uc3QganNEYXRlID0gdG9KU0RhdGUoZGF0ZSk7XG4gICAganNEYXRlLnNldERhdGUoanNEYXRlLmdldERhdGUoKSArIDQgLSAoanNEYXRlLmdldERheSgpIHx8IDcpKTsgIC8vIFRodXJzZGF5XG4gICAgY29uc3QgdGltZSA9IGpzRGF0ZS5nZXRUaW1lKCk7XG4gICAganNEYXRlLnNldE1vbnRoKDApOyAgLy8gQ29tcGFyZSB3aXRoIEphbiAxXG4gICAganNEYXRlLnNldERhdGUoMSk7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yb3VuZCgodGltZSAtIGpzRGF0ZS5nZXRUaW1lKCkpIC8gODY0MDAwMDApIC8gNykgKyAxO1xuICB9XG5cbiAgZ2V0VG9kYXkoKTogTmdiRGF0ZSB7IHJldHVybiBmcm9tSlNEYXRlKG5ldyBEYXRlKCkpOyB9XG5cbiAgaXNWYWxpZChkYXRlOiBOZ2JEYXRlKTogYm9vbGVhbiB7XG4gICAgaWYgKCFkYXRlIHx8ICFpc0ludGVnZXIoZGF0ZS55ZWFyKSB8fCAhaXNJbnRlZ2VyKGRhdGUubW9udGgpIHx8ICFpc0ludGVnZXIoZGF0ZS5kYXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8geWVhciAwIGRvZXNuJ3QgZXhpc3QgaW4gR3JlZ29yaWFuIGNhbGVuZGFyXG4gICAgaWYgKGRhdGUueWVhciA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGpzRGF0ZSA9IHRvSlNEYXRlKGRhdGUpO1xuXG4gICAgcmV0dXJuICFpc05hTihqc0RhdGUuZ2V0VGltZSgpKSAmJiBqc0RhdGUuZ2V0RnVsbFllYXIoKSA9PT0gZGF0ZS55ZWFyICYmIGpzRGF0ZS5nZXRNb250aCgpICsgMSA9PT0gZGF0ZS5tb250aCAmJlxuICAgICAgICBqc0RhdGUuZ2V0RGF0ZSgpID09PSBkYXRlLmRheTtcbiAgfVxufVxuIiwiaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuL25nYi1kYXRlJztcbmltcG9ydCB7RGF0ZXBpY2tlclZpZXdNb2RlbCwgRGF5Vmlld01vZGVsLCBNb250aFZpZXdNb2RlbH0gZnJvbSAnLi9kYXRlcGlja2VyLXZpZXctbW9kZWwnO1xuaW1wb3J0IHtOZ2JDYWxlbmRhcn0gZnJvbSAnLi9uZ2ItY2FsZW5kYXInO1xuaW1wb3J0IHtpc0RlZmluZWR9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJJMThufSBmcm9tICcuL2RhdGVwaWNrZXItaTE4bic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NoYW5nZWREYXRlKHByZXY6IE5nYkRhdGUsIG5leHQ6IE5nYkRhdGUpIHtcbiAgcmV0dXJuICFkYXRlQ29tcGFyYXRvcihwcmV2LCBuZXh0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVDb21wYXJhdG9yKHByZXY6IE5nYkRhdGUsIG5leHQ6IE5nYkRhdGUpIHtcbiAgcmV0dXJuICghcHJldiAmJiAhbmV4dCkgfHwgKCEhcHJldiAmJiAhIW5leHQgJiYgcHJldi5lcXVhbHMobmV4dCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tNaW5CZWZvcmVNYXgobWluRGF0ZTogTmdiRGF0ZSwgbWF4RGF0ZTogTmdiRGF0ZSkge1xuICBpZiAobWF4RGF0ZSAmJiBtaW5EYXRlICYmIG1heERhdGUuYmVmb3JlKG1pbkRhdGUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAnbWF4RGF0ZScgJHttYXhEYXRlfSBzaG91bGQgYmUgZ3JlYXRlciB0aGFuICdtaW5EYXRlJyAke21pbkRhdGV9YCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrRGF0ZUluUmFuZ2UoZGF0ZTogTmdiRGF0ZSwgbWluRGF0ZTogTmdiRGF0ZSwgbWF4RGF0ZTogTmdiRGF0ZSk6IE5nYkRhdGUge1xuICBpZiAoZGF0ZSAmJiBtaW5EYXRlICYmIGRhdGUuYmVmb3JlKG1pbkRhdGUpKSB7XG4gICAgcmV0dXJuIG1pbkRhdGU7XG4gIH1cbiAgaWYgKGRhdGUgJiYgbWF4RGF0ZSAmJiBkYXRlLmFmdGVyKG1heERhdGUpKSB7XG4gICAgcmV0dXJuIG1heERhdGU7XG4gIH1cblxuICByZXR1cm4gZGF0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGF0ZVNlbGVjdGFibGUoZGF0ZTogTmdiRGF0ZSwgc3RhdGU6IERhdGVwaWNrZXJWaWV3TW9kZWwpIHtcbiAgY29uc3Qge21pbkRhdGUsIG1heERhdGUsIGRpc2FibGVkLCBtYXJrRGlzYWJsZWR9ID0gc3RhdGU7XG4gIC8vIGNsYW5nLWZvcm1hdCBvZmZcbiAgcmV0dXJuICEoXG4gICAgIWlzRGVmaW5lZChkYXRlKSB8fFxuICAgIGRpc2FibGVkIHx8XG4gICAgKG1hcmtEaXNhYmxlZCAmJiBtYXJrRGlzYWJsZWQoZGF0ZSwge3llYXI6IGRhdGUueWVhciwgbW9udGg6IGRhdGUubW9udGh9KSkgfHxcbiAgICAobWluRGF0ZSAmJiBkYXRlLmJlZm9yZShtaW5EYXRlKSkgfHxcbiAgICAobWF4RGF0ZSAmJiBkYXRlLmFmdGVyKG1heERhdGUpKVxuICApO1xuICAvLyBjbGFuZy1mb3JtYXQgb25cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlU2VsZWN0Qm94TW9udGhzKGNhbGVuZGFyOiBOZ2JDYWxlbmRhciwgZGF0ZTogTmdiRGF0ZSwgbWluRGF0ZTogTmdiRGF0ZSwgbWF4RGF0ZTogTmdiRGF0ZSkge1xuICBpZiAoIWRhdGUpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBsZXQgbW9udGhzID0gY2FsZW5kYXIuZ2V0TW9udGhzKGRhdGUueWVhcik7XG5cbiAgaWYgKG1pbkRhdGUgJiYgZGF0ZS55ZWFyID09PSBtaW5EYXRlLnllYXIpIHtcbiAgICBjb25zdCBpbmRleCA9IG1vbnRocy5maW5kSW5kZXgobW9udGggPT4gbW9udGggPT09IG1pbkRhdGUubW9udGgpO1xuICAgIG1vbnRocyA9IG1vbnRocy5zbGljZShpbmRleCk7XG4gIH1cblxuICBpZiAobWF4RGF0ZSAmJiBkYXRlLnllYXIgPT09IG1heERhdGUueWVhcikge1xuICAgIGNvbnN0IGluZGV4ID0gbW9udGhzLmZpbmRJbmRleChtb250aCA9PiBtb250aCA9PT0gbWF4RGF0ZS5tb250aCk7XG4gICAgbW9udGhzID0gbW9udGhzLnNsaWNlKDAsIGluZGV4ICsgMSk7XG4gIH1cblxuICByZXR1cm4gbW9udGhzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVTZWxlY3RCb3hZZWFycyhkYXRlOiBOZ2JEYXRlLCBtaW5EYXRlOiBOZ2JEYXRlLCBtYXhEYXRlOiBOZ2JEYXRlKSB7XG4gIGlmICghZGF0ZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0ID0gbWluRGF0ZSAmJiBtaW5EYXRlLnllYXIgfHwgZGF0ZS55ZWFyIC0gMTA7XG4gIGNvbnN0IGVuZCA9IG1heERhdGUgJiYgbWF4RGF0ZS55ZWFyIHx8IGRhdGUueWVhciArIDEwO1xuXG4gIHJldHVybiBBcnJheS5mcm9tKHtsZW5ndGg6IGVuZCAtIHN0YXJ0ICsgMX0sIChlLCBpKSA9PiBzdGFydCArIGkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV4dE1vbnRoRGlzYWJsZWQoY2FsZW5kYXI6IE5nYkNhbGVuZGFyLCBkYXRlOiBOZ2JEYXRlLCBtYXhEYXRlOiBOZ2JEYXRlKSB7XG4gIHJldHVybiBtYXhEYXRlICYmIGNhbGVuZGFyLmdldE5leHQoZGF0ZSwgJ20nKS5hZnRlcihtYXhEYXRlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXZNb250aERpc2FibGVkKGNhbGVuZGFyOiBOZ2JDYWxlbmRhciwgZGF0ZTogTmdiRGF0ZSwgbWluRGF0ZTogTmdiRGF0ZSkge1xuICBjb25zdCBwcmV2RGF0ZSA9IGNhbGVuZGFyLmdldFByZXYoZGF0ZSwgJ20nKTtcbiAgcmV0dXJuIG1pbkRhdGUgJiYgKHByZXZEYXRlLnllYXIgPT09IG1pbkRhdGUueWVhciAmJiBwcmV2RGF0ZS5tb250aCA8IG1pbkRhdGUubW9udGggfHxcbiAgICAgICAgICAgICAgICAgICAgIHByZXZEYXRlLnllYXIgPCBtaW5EYXRlLnllYXIgJiYgbWluRGF0ZS5tb250aCA9PT0gMSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZE1vbnRocyhcbiAgICBjYWxlbmRhcjogTmdiQ2FsZW5kYXIsIGRhdGU6IE5nYkRhdGUsIHN0YXRlOiBEYXRlcGlja2VyVmlld01vZGVsLCBpMThuOiBOZ2JEYXRlcGlja2VySTE4bixcbiAgICBmb3JjZTogYm9vbGVhbik6IE1vbnRoVmlld01vZGVsW10ge1xuICBjb25zdCB7ZGlzcGxheU1vbnRocywgbW9udGhzfSA9IHN0YXRlO1xuICAvLyBtb3ZlIG9sZCBtb250aHMgdG8gYSB0ZW1wb3JhcnkgYXJyYXlcbiAgY29uc3QgbW9udGhzVG9SZXVzZSA9IG1vbnRocy5zcGxpY2UoMCwgbW9udGhzLmxlbmd0aCk7XG5cbiAgLy8gZ2VuZXJhdGUgbmV3IGZpcnN0IGRhdGVzLCBudWxsaWZ5IG9yIHJldXNlIG1vbnRoc1xuICBjb25zdCBmaXJzdERhdGVzID0gQXJyYXkuZnJvbSh7bGVuZ3RoOiBkaXNwbGF5TW9udGhzfSwgKF8sIGkpID0+IHtcbiAgICBjb25zdCBmaXJzdERhdGUgPSBjYWxlbmRhci5nZXROZXh0KGRhdGUsICdtJywgaSk7XG4gICAgbW9udGhzW2ldID0gbnVsbDtcblxuICAgIGlmICghZm9yY2UpIHtcbiAgICAgIGNvbnN0IHJldXNlZEluZGV4ID0gbW9udGhzVG9SZXVzZS5maW5kSW5kZXgobW9udGggPT4gbW9udGguZmlyc3REYXRlLmVxdWFscyhmaXJzdERhdGUpKTtcbiAgICAgIC8vIG1vdmUgcmV1c2VkIG1vbnRoIGJhY2sgdG8gbW9udGhzXG4gICAgICBpZiAocmV1c2VkSW5kZXggIT09IC0xKSB7XG4gICAgICAgIG1vbnRoc1tpXSA9IG1vbnRoc1RvUmV1c2Uuc3BsaWNlKHJldXNlZEluZGV4LCAxKVswXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmlyc3REYXRlO1xuICB9KTtcblxuICAvLyByZWJ1aWxkIG51bGxpZmllZCBtb250aHNcbiAgZmlyc3REYXRlcy5mb3JFYWNoKChmaXJzdERhdGUsIGkpID0+IHtcbiAgICBpZiAobW9udGhzW2ldID09PSBudWxsKSB7XG4gICAgICBtb250aHNbaV0gPSBidWlsZE1vbnRoKGNhbGVuZGFyLCBmaXJzdERhdGUsIHN0YXRlLCBpMThuLCBtb250aHNUb1JldXNlLnNoaWZ0KCkgfHwge30gYXMgTW9udGhWaWV3TW9kZWwpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG1vbnRocztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTW9udGgoXG4gICAgY2FsZW5kYXI6IE5nYkNhbGVuZGFyLCBkYXRlOiBOZ2JEYXRlLCBzdGF0ZTogRGF0ZXBpY2tlclZpZXdNb2RlbCwgaTE4bjogTmdiRGF0ZXBpY2tlckkxOG4sXG4gICAgbW9udGg6IE1vbnRoVmlld01vZGVsID0ge30gYXMgTW9udGhWaWV3TW9kZWwpOiBNb250aFZpZXdNb2RlbCB7XG4gIGNvbnN0IHtkYXlUZW1wbGF0ZURhdGEsIG1pbkRhdGUsIG1heERhdGUsIGZpcnN0RGF5T2ZXZWVrLCBtYXJrRGlzYWJsZWQsIG91dHNpZGVEYXlzfSA9IHN0YXRlO1xuXG4gIG1vbnRoLmZpcnN0RGF0ZSA9IG51bGw7XG4gIG1vbnRoLmxhc3REYXRlID0gbnVsbDtcbiAgbW9udGgubnVtYmVyID0gZGF0ZS5tb250aDtcbiAgbW9udGgueWVhciA9IGRhdGUueWVhcjtcbiAgbW9udGgud2Vla3MgPSBtb250aC53ZWVrcyB8fCBbXTtcbiAgbW9udGgud2Vla2RheXMgPSBtb250aC53ZWVrZGF5cyB8fCBbXTtcblxuICBkYXRlID0gZ2V0Rmlyc3RWaWV3RGF0ZShjYWxlbmRhciwgZGF0ZSwgZmlyc3REYXlPZldlZWspO1xuXG4gIC8vIG1vbnRoIGhhcyB3ZWVrc1xuICBmb3IgKGxldCB3ZWVrID0gMDsgd2VlayA8IGNhbGVuZGFyLmdldFdlZWtzUGVyTW9udGgoKTsgd2VlaysrKSB7XG4gICAgbGV0IHdlZWtPYmplY3QgPSBtb250aC53ZWVrc1t3ZWVrXTtcbiAgICBpZiAoIXdlZWtPYmplY3QpIHtcbiAgICAgIHdlZWtPYmplY3QgPSBtb250aC53ZWVrc1t3ZWVrXSA9IHtudW1iZXI6IDAsIGRheXM6IFtdLCBjb2xsYXBzZWQ6IHRydWV9O1xuICAgIH1cbiAgICBjb25zdCBkYXlzID0gd2Vla09iamVjdC5kYXlzO1xuXG4gICAgLy8gd2VlayBoYXMgZGF5c1xuICAgIGZvciAobGV0IGRheSA9IDA7IGRheSA8IGNhbGVuZGFyLmdldERheXNQZXJXZWVrKCk7IGRheSsrKSB7XG4gICAgICBpZiAod2VlayA9PT0gMCkge1xuICAgICAgICBtb250aC53ZWVrZGF5c1tkYXldID0gY2FsZW5kYXIuZ2V0V2Vla2RheShkYXRlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmV3RGF0ZSA9IG5ldyBOZ2JEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCwgZGF0ZS5kYXkpO1xuICAgICAgY29uc3QgbmV4dERhdGUgPSBjYWxlbmRhci5nZXROZXh0KG5ld0RhdGUpO1xuXG4gICAgICBjb25zdCBhcmlhTGFiZWwgPSBpMThuLmdldERheUFyaWFMYWJlbChuZXdEYXRlKTtcblxuICAgICAgLy8gbWFya2luZyBkYXRlIGFzIGRpc2FibGVkXG4gICAgICBsZXQgZGlzYWJsZWQgPSAhISgobWluRGF0ZSAmJiBuZXdEYXRlLmJlZm9yZShtaW5EYXRlKSkgfHwgKG1heERhdGUgJiYgbmV3RGF0ZS5hZnRlcihtYXhEYXRlKSkpO1xuICAgICAgaWYgKCFkaXNhYmxlZCAmJiBtYXJrRGlzYWJsZWQpIHtcbiAgICAgICAgZGlzYWJsZWQgPSBtYXJrRGlzYWJsZWQobmV3RGF0ZSwge21vbnRoOiBtb250aC5udW1iZXIsIHllYXI6IG1vbnRoLnllYXJ9KTtcbiAgICAgIH1cblxuICAgICAgLy8gYWRkaW5nIHVzZXItcHJvdmlkZWQgZGF0YSB0byB0aGUgY29udGV4dFxuICAgICAgbGV0IGNvbnRleHRVc2VyRGF0YSA9XG4gICAgICAgICAgZGF5VGVtcGxhdGVEYXRhID8gZGF5VGVtcGxhdGVEYXRhKG5ld0RhdGUsIHttb250aDogbW9udGgubnVtYmVyLCB5ZWFyOiBtb250aC55ZWFyfSkgOiB1bmRlZmluZWQ7XG5cbiAgICAgIC8vIHNhdmluZyBmaXJzdCBkYXRlIG9mIHRoZSBtb250aFxuICAgICAgaWYgKG1vbnRoLmZpcnN0RGF0ZSA9PT0gbnVsbCAmJiBuZXdEYXRlLm1vbnRoID09PSBtb250aC5udW1iZXIpIHtcbiAgICAgICAgbW9udGguZmlyc3REYXRlID0gbmV3RGF0ZTtcbiAgICAgIH1cblxuICAgICAgLy8gc2F2aW5nIGxhc3QgZGF0ZSBvZiB0aGUgbW9udGhcbiAgICAgIGlmIChuZXdEYXRlLm1vbnRoID09PSBtb250aC5udW1iZXIgJiYgbmV4dERhdGUubW9udGggIT09IG1vbnRoLm51bWJlcikge1xuICAgICAgICBtb250aC5sYXN0RGF0ZSA9IG5ld0RhdGU7XG4gICAgICB9XG5cbiAgICAgIGxldCBkYXlPYmplY3QgPSBkYXlzW2RheV07XG4gICAgICBpZiAoIWRheU9iamVjdCkge1xuICAgICAgICBkYXlPYmplY3QgPSBkYXlzW2RheV0gPSB7fSBhcyBEYXlWaWV3TW9kZWw7XG4gICAgICB9XG4gICAgICBkYXlPYmplY3QuZGF0ZSA9IG5ld0RhdGU7XG4gICAgICBkYXlPYmplY3QuY29udGV4dCA9IE9iamVjdC5hc3NpZ24oZGF5T2JqZWN0LmNvbnRleHQgfHwge30sIHtcbiAgICAgICAgJGltcGxpY2l0OiBuZXdEYXRlLFxuICAgICAgICBkYXRlOiBuZXdEYXRlLFxuICAgICAgICBkYXRhOiBjb250ZXh0VXNlckRhdGEsXG4gICAgICAgIGN1cnJlbnRNb250aDogbW9udGgubnVtYmVyLCBkaXNhYmxlZCxcbiAgICAgICAgZm9jdXNlZDogZmFsc2UsXG4gICAgICAgIHNlbGVjdGVkOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBkYXlPYmplY3QudGFiaW5kZXggPSAtMTtcbiAgICAgIGRheU9iamVjdC5hcmlhTGFiZWwgPSBhcmlhTGFiZWw7XG4gICAgICBkYXlPYmplY3QuaGlkZGVuID0gZmFsc2U7XG5cbiAgICAgIGRhdGUgPSBuZXh0RGF0ZTtcbiAgICB9XG5cbiAgICB3ZWVrT2JqZWN0Lm51bWJlciA9IGNhbGVuZGFyLmdldFdlZWtOdW1iZXIoZGF5cy5tYXAoZGF5ID0+IGRheS5kYXRlKSwgZmlyc3REYXlPZldlZWspO1xuXG4gICAgLy8gbWFya2luZyB3ZWVrIGFzIGNvbGxhcHNlZFxuICAgIHdlZWtPYmplY3QuY29sbGFwc2VkID0gb3V0c2lkZURheXMgPT09ICdjb2xsYXBzZWQnICYmIGRheXNbMF0uZGF0ZS5tb250aCAhPT0gbW9udGgubnVtYmVyICYmXG4gICAgICAgIGRheXNbZGF5cy5sZW5ndGggLSAxXS5kYXRlLm1vbnRoICE9PSBtb250aC5udW1iZXI7XG4gIH1cblxuICByZXR1cm4gbW9udGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaXJzdFZpZXdEYXRlKGNhbGVuZGFyOiBOZ2JDYWxlbmRhciwgZGF0ZTogTmdiRGF0ZSwgZmlyc3REYXlPZldlZWs6IG51bWJlcik6IE5nYkRhdGUge1xuICBjb25zdCBkYXlzUGVyV2VlayA9IGNhbGVuZGFyLmdldERheXNQZXJXZWVrKCk7XG4gIGNvbnN0IGZpcnN0TW9udGhEYXRlID0gbmV3IE5nYkRhdGUoZGF0ZS55ZWFyLCBkYXRlLm1vbnRoLCAxKTtcbiAgY29uc3QgZGF5T2ZXZWVrID0gY2FsZW5kYXIuZ2V0V2Vla2RheShmaXJzdE1vbnRoRGF0ZSkgJSBkYXlzUGVyV2VlaztcbiAgcmV0dXJuIGNhbGVuZGFyLmdldFByZXYoZmlyc3RNb250aERhdGUsICdkJywgKGRheXNQZXJXZWVrICsgZGF5T2ZXZWVrIC0gZmlyc3REYXlPZldlZWspICUgZGF5c1BlcldlZWspO1xufVxuIiwiaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIExPQ0FMRV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1TdHlsZSwgZ2V0TG9jYWxlRGF5TmFtZXMsIGdldExvY2FsZU1vbnRoTmFtZXMsIFRyYW5zbGF0aW9uV2lkdGgsIGZvcm1hdERhdGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIE5HQl9EQVRFUElDS0VSXzE4Tl9GQUNUT1JZKGxvY2FsZSkge1xuICByZXR1cm4gbmV3IE5nYkRhdGVwaWNrZXJJMThuRGVmYXVsdChsb2NhbGUpO1xufVxuXG4vKipcbiAqIFR5cGUgb2YgdGhlIHNlcnZpY2Ugc3VwcGx5aW5nIG1vbnRoIGFuZCB3ZWVrZGF5IG5hbWVzIHRvIHRvIE5nYkRhdGVwaWNrZXIgY29tcG9uZW50LlxuICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBzZXJ2aWNlIGhvbm9ycyB0aGUgQW5ndWxhciBsb2NhbGUsIGFuZCB1c2VzIHRoZSByZWdpc3RlcmVkIGxvY2FsZSBkYXRhLFxuICogYXMgZXhwbGFpbmVkIGluIHRoZSBBbmd1bGFyIGkxOG4gZ3VpZGUuXG4gKiBTZWUgdGhlIGkxOG4gZGVtbyBmb3IgaG93IHRvIGV4dGVuZCB0aGlzIGNsYXNzIGFuZCBkZWZpbmUgYSBjdXN0b20gcHJvdmlkZXIgZm9yIGkxOG4uXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCcsIHVzZUZhY3Rvcnk6IE5HQl9EQVRFUElDS0VSXzE4Tl9GQUNUT1JZLCBkZXBzOiBbTE9DQUxFX0lEXX0pXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTmdiRGF0ZXBpY2tlckkxOG4ge1xuICAvKipcbiAgICogUmV0dXJucyB0aGUgc2hvcnQgd2Vla2RheSBuYW1lIHRvIGRpc3BsYXkgaW4gdGhlIGhlYWRpbmcgb2YgdGhlIG1vbnRoIHZpZXcuXG4gICAqIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICd3ZWVrZGF5JyBpcyAxPU1vbiAuLi4gNz1TdW5cbiAgICovXG4gIGFic3RyYWN0IGdldFdlZWtkYXlTaG9ydE5hbWUod2Vla2RheTogbnVtYmVyKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzaG9ydCBtb250aCBuYW1lIHRvIGRpc3BsYXkgaW4gdGhlIGRhdGUgcGlja2VyIG5hdmlnYXRpb24uXG4gICAqIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICdtb250aCcgaXMgMT1KYW4gLi4uIDEyPURlY1xuICAgKi9cbiAgYWJzdHJhY3QgZ2V0TW9udGhTaG9ydE5hbWUobW9udGg6IG51bWJlciwgeWVhcj86IG51bWJlcik6IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZnVsbCBtb250aCBuYW1lIHRvIGRpc3BsYXkgaW4gdGhlIGRhdGUgcGlja2VyIG5hdmlnYXRpb24uXG4gICAqIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICdtb250aCcgaXMgMT1KYW51YXJ5IC4uLiAxMj1EZWNlbWJlclxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0TW9udGhGdWxsTmFtZShtb250aDogbnVtYmVyLCB5ZWFyPzogbnVtYmVyKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgJ2FyaWEtbGFiZWwnIGF0dHJpYnV0ZSBmb3IgYSBzcGVjaWZpYyBkYXRlXG4gICAqXG4gICAqIEBzaW5jZSAyLjAuMFxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0RGF5QXJpYUxhYmVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgYSBkYXkgdGhhdCBpcyByZW5kZXJlZCBpbiBhIGRheSBjZWxsXG4gICAqXG4gICAqIEBzaW5jZSAzLjAuMFxuICAgKi9cbiAgZ2V0RGF5TnVtZXJhbHMoZGF0ZTogTmdiRGF0ZVN0cnVjdCk6IHN0cmluZyB7IHJldHVybiBgJHtkYXRlLmRheX1gOyB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgYSB3ZWVrIG51bWJlciByZW5kZXJlZCBieSBkYXRlIHBpY2tlclxuICAgKlxuICAgKiBAc2luY2UgMy4wLjBcbiAgICovXG4gIGdldFdlZWtOdW1lcmFscyh3ZWVrTnVtYmVyOiBudW1iZXIpOiBzdHJpbmcgeyByZXR1cm4gYCR7d2Vla051bWJlcn1gOyB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgYSB5ZWFyIHRoYXQgaXMgcmVuZGVyZWRcbiAgICogaW4gZGF0ZSBwaWNrZXIgeWVhciBzZWxlY3QgYm94XG4gICAqXG4gICAqIEBzaW5jZSAzLjAuMFxuICAgKi9cbiAgZ2V0WWVhck51bWVyYWxzKHllYXI6IG51bWJlcik6IHN0cmluZyB7IHJldHVybiBgJHt5ZWFyfWA7IH1cbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVwaWNrZXJJMThuRGVmYXVsdCBleHRlbmRzIE5nYkRhdGVwaWNrZXJJMThuIHtcbiAgcHJpdmF0ZSBfd2Vla2RheXNTaG9ydDogQXJyYXk8c3RyaW5nPjtcbiAgcHJpdmF0ZSBfbW9udGhzU2hvcnQ6IEFycmF5PHN0cmluZz47XG4gIHByaXZhdGUgX21vbnRoc0Z1bGw6IEFycmF5PHN0cmluZz47XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfSUQpIHByaXZhdGUgX2xvY2FsZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGNvbnN0IHdlZWtkYXlzU3RhcnRpbmdPblN1bmRheSA9IGdldExvY2FsZURheU5hbWVzKF9sb2NhbGUsIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLlNob3J0KTtcbiAgICB0aGlzLl93ZWVrZGF5c1Nob3J0ID0gd2Vla2RheXNTdGFydGluZ09uU3VuZGF5Lm1hcCgoZGF5LCBpbmRleCkgPT4gd2Vla2RheXNTdGFydGluZ09uU3VuZGF5WyhpbmRleCArIDEpICUgN10pO1xuXG4gICAgdGhpcy5fbW9udGhzU2hvcnQgPSBnZXRMb2NhbGVNb250aE5hbWVzKF9sb2NhbGUsIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLkFiYnJldmlhdGVkKTtcbiAgICB0aGlzLl9tb250aHNGdWxsID0gZ2V0TG9jYWxlTW9udGhOYW1lcyhfbG9jYWxlLCBGb3JtU3R5bGUuU3RhbmRhbG9uZSwgVHJhbnNsYXRpb25XaWR0aC5XaWRlKTtcbiAgfVxuXG4gIGdldFdlZWtkYXlTaG9ydE5hbWUod2Vla2RheTogbnVtYmVyKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRbd2Vla2RheSAtIDFdOyB9XG5cbiAgZ2V0TW9udGhTaG9ydE5hbWUobW9udGg6IG51bWJlcik6IHN0cmluZyB7IHJldHVybiB0aGlzLl9tb250aHNTaG9ydFttb250aCAtIDFdOyB9XG5cbiAgZ2V0TW9udGhGdWxsTmFtZShtb250aDogbnVtYmVyKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX21vbnRoc0Z1bGxbbW9udGggLSAxXTsgfVxuXG4gIGdldERheUFyaWFMYWJlbChkYXRlOiBOZ2JEYXRlU3RydWN0KTogc3RyaW5nIHtcbiAgICBjb25zdCBqc0RhdGUgPSBuZXcgRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGggLSAxLCBkYXRlLmRheSk7XG4gICAgcmV0dXJuIGZvcm1hdERhdGUoanNEYXRlLCAnZnVsbERhdGUnLCB0aGlzLl9sb2NhbGUpO1xuICB9XG59XG4iLCJpbXBvcnQge05nYkNhbGVuZGFyLCBOZ2JQZXJpb2R9IGZyb20gJy4vbmdiLWNhbGVuZGFyJztcbmltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcbmltcG9ydCB7RGF0ZXBpY2tlclZpZXdNb2RlbCwgTmdiRGF5VGVtcGxhdGVEYXRhLCBOZ2JNYXJrRGlzYWJsZWR9IGZyb20gJy4vZGF0ZXBpY2tlci12aWV3LW1vZGVsJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzSW50ZWdlciwgdG9JbnRlZ2VyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGJ1aWxkTW9udGhzLFxuICBjaGVja0RhdGVJblJhbmdlLFxuICBjaGVja01pbkJlZm9yZU1heCxcbiAgaXNDaGFuZ2VkRGF0ZSxcbiAgaXNEYXRlU2VsZWN0YWJsZSxcbiAgZ2VuZXJhdGVTZWxlY3RCb3hZZWFycyxcbiAgZ2VuZXJhdGVTZWxlY3RCb3hNb250aHMsXG4gIHByZXZNb250aERpc2FibGVkLFxuICBuZXh0TW9udGhEaXNhYmxlZFxufSBmcm9tICcuL2RhdGVwaWNrZXItdG9vbHMnO1xuXG5pbXBvcnQge2ZpbHRlcn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VySTE4bn0gZnJvbSAnLi9kYXRlcGlja2VyLWkxOG4nO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlclNlcnZpY2Uge1xuICBwcml2YXRlIF9tb2RlbCQgPSBuZXcgU3ViamVjdDxEYXRlcGlja2VyVmlld01vZGVsPigpO1xuXG4gIHByaXZhdGUgX3NlbGVjdCQgPSBuZXcgU3ViamVjdDxOZ2JEYXRlPigpO1xuXG4gIHByaXZhdGUgX3N0YXRlOiBEYXRlcGlja2VyVmlld01vZGVsID0ge1xuICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICBkaXNwbGF5TW9udGhzOiAxLFxuICAgIGZpcnN0RGF5T2ZXZWVrOiAxLFxuICAgIGZvY3VzVmlzaWJsZTogZmFsc2UsXG4gICAgbW9udGhzOiBbXSxcbiAgICBuYXZpZ2F0aW9uOiAnc2VsZWN0JyxcbiAgICBvdXRzaWRlRGF5czogJ3Zpc2libGUnLFxuICAgIHByZXZEaXNhYmxlZDogZmFsc2UsXG4gICAgbmV4dERpc2FibGVkOiBmYWxzZSxcbiAgICBzZWxlY3RCb3hlczoge3llYXJzOiBbXSwgbW9udGhzOiBbXX0sXG4gICAgc2VsZWN0ZWREYXRlOiBudWxsXG4gIH07XG5cbiAgZ2V0IG1vZGVsJCgpOiBPYnNlcnZhYmxlPERhdGVwaWNrZXJWaWV3TW9kZWw+IHsgcmV0dXJuIHRoaXMuX21vZGVsJC5waXBlKGZpbHRlcihtb2RlbCA9PiBtb2RlbC5tb250aHMubGVuZ3RoID4gMCkpOyB9XG5cbiAgZ2V0IHNlbGVjdCQoKTogT2JzZXJ2YWJsZTxOZ2JEYXRlPiB7IHJldHVybiB0aGlzLl9zZWxlY3QkLnBpcGUoZmlsdGVyKGRhdGUgPT4gZGF0ZSAhPT0gbnVsbCkpOyB9XG5cbiAgc2V0IGRheVRlbXBsYXRlRGF0YShkYXlUZW1wbGF0ZURhdGE6IE5nYkRheVRlbXBsYXRlRGF0YSkge1xuICAgIGlmICh0aGlzLl9zdGF0ZS5kYXlUZW1wbGF0ZURhdGEgIT09IGRheVRlbXBsYXRlRGF0YSkge1xuICAgICAgdGhpcy5fbmV4dFN0YXRlKHtkYXlUZW1wbGF0ZURhdGF9KTtcbiAgICB9XG4gIH1cblxuICBzZXQgZGlzYWJsZWQoZGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5fc3RhdGUuZGlzYWJsZWQgIT09IGRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9uZXh0U3RhdGUoe2Rpc2FibGVkfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0IGRpc3BsYXlNb250aHMoZGlzcGxheU1vbnRoczogbnVtYmVyKSB7XG4gICAgZGlzcGxheU1vbnRocyA9IHRvSW50ZWdlcihkaXNwbGF5TW9udGhzKTtcbiAgICBpZiAoaXNJbnRlZ2VyKGRpc3BsYXlNb250aHMpICYmIGRpc3BsYXlNb250aHMgPiAwICYmIHRoaXMuX3N0YXRlLmRpc3BsYXlNb250aHMgIT09IGRpc3BsYXlNb250aHMpIHtcbiAgICAgIHRoaXMuX25leHRTdGF0ZSh7ZGlzcGxheU1vbnRoc30pO1xuICAgIH1cbiAgfVxuXG4gIHNldCBmaXJzdERheU9mV2VlayhmaXJzdERheU9mV2VlazogbnVtYmVyKSB7XG4gICAgZmlyc3REYXlPZldlZWsgPSB0b0ludGVnZXIoZmlyc3REYXlPZldlZWspO1xuICAgIGlmIChpc0ludGVnZXIoZmlyc3REYXlPZldlZWspICYmIGZpcnN0RGF5T2ZXZWVrID49IDAgJiYgdGhpcy5fc3RhdGUuZmlyc3REYXlPZldlZWsgIT09IGZpcnN0RGF5T2ZXZWVrKSB7XG4gICAgICB0aGlzLl9uZXh0U3RhdGUoe2ZpcnN0RGF5T2ZXZWVrfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0IGZvY3VzVmlzaWJsZShmb2N1c1Zpc2libGU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5fc3RhdGUuZm9jdXNWaXNpYmxlICE9PSBmb2N1c1Zpc2libGUgJiYgIXRoaXMuX3N0YXRlLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9uZXh0U3RhdGUoe2ZvY3VzVmlzaWJsZX0pO1xuICAgIH1cbiAgfVxuXG4gIHNldCBtYXhEYXRlKGRhdGU6IE5nYkRhdGUpIHtcbiAgICBjb25zdCBtYXhEYXRlID0gdGhpcy50b1ZhbGlkRGF0ZShkYXRlLCBudWxsKTtcbiAgICBpZiAoaXNDaGFuZ2VkRGF0ZSh0aGlzLl9zdGF0ZS5tYXhEYXRlLCBtYXhEYXRlKSkge1xuICAgICAgdGhpcy5fbmV4dFN0YXRlKHttYXhEYXRlfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0IG1hcmtEaXNhYmxlZChtYXJrRGlzYWJsZWQ6IE5nYk1hcmtEaXNhYmxlZCkge1xuICAgIGlmICh0aGlzLl9zdGF0ZS5tYXJrRGlzYWJsZWQgIT09IG1hcmtEaXNhYmxlZCkge1xuICAgICAgdGhpcy5fbmV4dFN0YXRlKHttYXJrRGlzYWJsZWR9KTtcbiAgICB9XG4gIH1cblxuICBzZXQgbWluRGF0ZShkYXRlOiBOZ2JEYXRlKSB7XG4gICAgY29uc3QgbWluRGF0ZSA9IHRoaXMudG9WYWxpZERhdGUoZGF0ZSwgbnVsbCk7XG4gICAgaWYgKGlzQ2hhbmdlZERhdGUodGhpcy5fc3RhdGUubWluRGF0ZSwgbWluRGF0ZSkpIHtcbiAgICAgIHRoaXMuX25leHRTdGF0ZSh7bWluRGF0ZX0pO1xuICAgIH1cbiAgfVxuXG4gIHNldCBuYXZpZ2F0aW9uKG5hdmlnYXRpb246ICdzZWxlY3QnIHwgJ2Fycm93cycgfCAnbm9uZScpIHtcbiAgICBpZiAodGhpcy5fc3RhdGUubmF2aWdhdGlvbiAhPT0gbmF2aWdhdGlvbikge1xuICAgICAgdGhpcy5fbmV4dFN0YXRlKHtuYXZpZ2F0aW9ufSk7XG4gICAgfVxuICB9XG5cbiAgc2V0IG91dHNpZGVEYXlzKG91dHNpZGVEYXlzOiAndmlzaWJsZScgfCAnY29sbGFwc2VkJyB8ICdoaWRkZW4nKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlLm91dHNpZGVEYXlzICE9PSBvdXRzaWRlRGF5cykge1xuICAgICAgdGhpcy5fbmV4dFN0YXRlKHtvdXRzaWRlRGF5c30pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2NhbGVuZGFyOiBOZ2JDYWxlbmRhciwgcHJpdmF0ZSBfaTE4bjogTmdiRGF0ZXBpY2tlckkxOG4pIHt9XG5cbiAgZm9jdXMoZGF0ZTogTmdiRGF0ZSkge1xuICAgIGlmICghdGhpcy5fc3RhdGUuZGlzYWJsZWQgJiYgdGhpcy5fY2FsZW5kYXIuaXNWYWxpZChkYXRlKSAmJiBpc0NoYW5nZWREYXRlKHRoaXMuX3N0YXRlLmZvY3VzRGF0ZSwgZGF0ZSkpIHtcbiAgICAgIHRoaXMuX25leHRTdGF0ZSh7Zm9jdXNEYXRlOiBkYXRlfSk7XG4gICAgfVxuICB9XG5cbiAgZm9jdXNNb3ZlKHBlcmlvZD86IE5nYlBlcmlvZCwgbnVtYmVyPzogbnVtYmVyKSB7XG4gICAgdGhpcy5mb2N1cyh0aGlzLl9jYWxlbmRhci5nZXROZXh0KHRoaXMuX3N0YXRlLmZvY3VzRGF0ZSwgcGVyaW9kLCBudW1iZXIpKTtcbiAgfVxuXG4gIGZvY3VzU2VsZWN0KCkge1xuICAgIGlmIChpc0RhdGVTZWxlY3RhYmxlKHRoaXMuX3N0YXRlLmZvY3VzRGF0ZSwgdGhpcy5fc3RhdGUpKSB7XG4gICAgICB0aGlzLnNlbGVjdCh0aGlzLl9zdGF0ZS5mb2N1c0RhdGUsIHtlbWl0RXZlbnQ6IHRydWV9KTtcbiAgICB9XG4gIH1cblxuICBvcGVuKGRhdGU6IE5nYkRhdGUpIHtcbiAgICBjb25zdCBmaXJzdERhdGUgPSB0aGlzLnRvVmFsaWREYXRlKGRhdGUsIHRoaXMuX2NhbGVuZGFyLmdldFRvZGF5KCkpO1xuICAgIGlmICghdGhpcy5fc3RhdGUuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX25leHRTdGF0ZSh7Zmlyc3REYXRlfSk7XG4gICAgfVxuICB9XG5cbiAgc2VsZWN0KGRhdGU6IE5nYkRhdGUsIG9wdGlvbnM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KSB7XG4gICAgY29uc3Qgc2VsZWN0ZWREYXRlID0gdGhpcy50b1ZhbGlkRGF0ZShkYXRlLCBudWxsKTtcbiAgICBpZiAoIXRoaXMuX3N0YXRlLmRpc2FibGVkKSB7XG4gICAgICBpZiAoaXNDaGFuZ2VkRGF0ZSh0aGlzLl9zdGF0ZS5zZWxlY3RlZERhdGUsIHNlbGVjdGVkRGF0ZSkpIHtcbiAgICAgICAgdGhpcy5fbmV4dFN0YXRlKHtzZWxlY3RlZERhdGV9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuZW1pdEV2ZW50ICYmIGlzRGF0ZVNlbGVjdGFibGUoc2VsZWN0ZWREYXRlLCB0aGlzLl9zdGF0ZSkpIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0JC5uZXh0KHNlbGVjdGVkRGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdG9WYWxpZERhdGUoZGF0ZTogTmdiRGF0ZVN0cnVjdCwgZGVmYXVsdFZhbHVlPzogTmdiRGF0ZSk6IE5nYkRhdGUge1xuICAgIGNvbnN0IG5nYkRhdGUgPSBOZ2JEYXRlLmZyb20oZGF0ZSk7XG4gICAgaWYgKGRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSB0aGlzLl9jYWxlbmRhci5nZXRUb2RheSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY2FsZW5kYXIuaXNWYWxpZChuZ2JEYXRlKSA/IG5nYkRhdGUgOiBkZWZhdWx0VmFsdWU7XG4gIH1cblxuICBwcml2YXRlIF9uZXh0U3RhdGUocGF0Y2g6IFBhcnRpYWw8RGF0ZXBpY2tlclZpZXdNb2RlbD4pIHtcbiAgICBjb25zdCBuZXdTdGF0ZSA9IHRoaXMuX3VwZGF0ZVN0YXRlKHBhdGNoKTtcbiAgICB0aGlzLl9wYXRjaENvbnRleHRzKG5ld1N0YXRlKTtcbiAgICB0aGlzLl9zdGF0ZSA9IG5ld1N0YXRlO1xuICAgIHRoaXMuX21vZGVsJC5uZXh0KHRoaXMuX3N0YXRlKTtcbiAgfVxuXG4gIHByaXZhdGUgX3BhdGNoQ29udGV4dHMoc3RhdGU6IERhdGVwaWNrZXJWaWV3TW9kZWwpIHtcbiAgICBjb25zdCB7bW9udGhzLCBkaXNwbGF5TW9udGhzLCBzZWxlY3RlZERhdGUsIGZvY3VzRGF0ZSwgZm9jdXNWaXNpYmxlLCBkaXNhYmxlZCwgb3V0c2lkZURheXN9ID0gc3RhdGU7XG4gICAgc3RhdGUubW9udGhzLmZvckVhY2gobW9udGggPT4ge1xuICAgICAgbW9udGgud2Vla3MuZm9yRWFjaCh3ZWVrID0+IHtcbiAgICAgICAgd2Vlay5kYXlzLmZvckVhY2goZGF5ID0+IHtcblxuICAgICAgICAgIC8vIHBhdGNoIGZvY3VzIGZsYWdcbiAgICAgICAgICBpZiAoZm9jdXNEYXRlKSB7XG4gICAgICAgICAgICBkYXkuY29udGV4dC5mb2N1c2VkID0gZm9jdXNEYXRlLmVxdWFscyhkYXkuZGF0ZSkgJiYgZm9jdXNWaXNpYmxlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGNhbGN1bGF0aW5nIHRhYmluZGV4XG4gICAgICAgICAgZGF5LnRhYmluZGV4ID0gIWRpc2FibGVkICYmIGRheS5kYXRlLmVxdWFscyhmb2N1c0RhdGUpICYmIGZvY3VzRGF0ZS5tb250aCA9PT0gbW9udGgubnVtYmVyID8gMCA6IC0xO1xuXG4gICAgICAgICAgLy8gb3ZlcnJpZGUgY29udGV4dCBkaXNhYmxlZFxuICAgICAgICAgIGlmIChkaXNhYmxlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZGF5LmNvbnRleHQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHBhdGNoIHNlbGVjdGlvbiBmbGFnXG4gICAgICAgICAgaWYgKHNlbGVjdGVkRGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkYXkuY29udGV4dC5zZWxlY3RlZCA9IHNlbGVjdGVkRGF0ZSAhPT0gbnVsbCAmJiBzZWxlY3RlZERhdGUuZXF1YWxzKGRheS5kYXRlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyB2aXNpYmlsaXR5XG4gICAgICAgICAgaWYgKG1vbnRoLm51bWJlciAhPT0gZGF5LmRhdGUubW9udGgpIHtcbiAgICAgICAgICAgIGRheS5oaWRkZW4gPSBvdXRzaWRlRGF5cyA9PT0gJ2hpZGRlbicgfHwgb3V0c2lkZURheXMgPT09ICdjb2xsYXBzZWQnIHx8XG4gICAgICAgICAgICAgICAgKGRpc3BsYXlNb250aHMgPiAxICYmIGRheS5kYXRlLmFmdGVyKG1vbnRoc1swXS5maXJzdERhdGUpICYmXG4gICAgICAgICAgICAgICAgIGRheS5kYXRlLmJlZm9yZShtb250aHNbZGlzcGxheU1vbnRocyAtIDFdLmxhc3REYXRlKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlU3RhdGUocGF0Y2g6IFBhcnRpYWw8RGF0ZXBpY2tlclZpZXdNb2RlbD4pOiBEYXRlcGlja2VyVmlld01vZGVsIHtcbiAgICAvLyBwYXRjaGluZyBmaWVsZHNcbiAgICBjb25zdCBzdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX3N0YXRlLCBwYXRjaCk7XG5cbiAgICBsZXQgc3RhcnREYXRlID0gc3RhdGUuZmlyc3REYXRlO1xuXG4gICAgLy8gbWluL21heCBkYXRlcyBjaGFuZ2VkXG4gICAgaWYgKCdtaW5EYXRlJyBpbiBwYXRjaCB8fCAnbWF4RGF0ZScgaW4gcGF0Y2gpIHtcbiAgICAgIGNoZWNrTWluQmVmb3JlTWF4KHN0YXRlLm1pbkRhdGUsIHN0YXRlLm1heERhdGUpO1xuICAgICAgc3RhdGUuZm9jdXNEYXRlID0gY2hlY2tEYXRlSW5SYW5nZShzdGF0ZS5mb2N1c0RhdGUsIHN0YXRlLm1pbkRhdGUsIHN0YXRlLm1heERhdGUpO1xuICAgICAgc3RhdGUuZmlyc3REYXRlID0gY2hlY2tEYXRlSW5SYW5nZShzdGF0ZS5maXJzdERhdGUsIHN0YXRlLm1pbkRhdGUsIHN0YXRlLm1heERhdGUpO1xuICAgICAgc3RhcnREYXRlID0gc3RhdGUuZm9jdXNEYXRlO1xuICAgIH1cblxuICAgIC8vIGRpc2FibGVkXG4gICAgaWYgKCdkaXNhYmxlZCcgaW4gcGF0Y2gpIHtcbiAgICAgIHN0YXRlLmZvY3VzVmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGluaXRpYWwgcmVidWlsZCB2aWEgJ3NlbGVjdCgpJ1xuICAgIGlmICgnc2VsZWN0ZWREYXRlJyBpbiBwYXRjaCAmJiB0aGlzLl9zdGF0ZS5tb250aHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBzdGFydERhdGUgPSBzdGF0ZS5zZWxlY3RlZERhdGU7XG4gICAgfVxuXG4gICAgLy8gZm9jdXMgZGF0ZSBjaGFuZ2VkXG4gICAgaWYgKCdmb2N1c0RhdGUnIGluIHBhdGNoKSB7XG4gICAgICBzdGF0ZS5mb2N1c0RhdGUgPSBjaGVja0RhdGVJblJhbmdlKHN0YXRlLmZvY3VzRGF0ZSwgc3RhdGUubWluRGF0ZSwgc3RhdGUubWF4RGF0ZSk7XG4gICAgICBzdGFydERhdGUgPSBzdGF0ZS5mb2N1c0RhdGU7XG5cbiAgICAgIC8vIG5vdGhpbmcgdG8gcmVidWlsZCBpZiBvbmx5IGZvY3VzIGNoYW5nZWQgYW5kIGl0IGlzIHN0aWxsIHZpc2libGVcbiAgICAgIGlmIChzdGF0ZS5tb250aHMubGVuZ3RoICE9PSAwICYmICFzdGF0ZS5mb2N1c0RhdGUuYmVmb3JlKHN0YXRlLmZpcnN0RGF0ZSkgJiZcbiAgICAgICAgICAhc3RhdGUuZm9jdXNEYXRlLmFmdGVyKHN0YXRlLmxhc3REYXRlKSkge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZmlyc3QgZGF0ZSBjaGFuZ2VkXG4gICAgaWYgKCdmaXJzdERhdGUnIGluIHBhdGNoKSB7XG4gICAgICBzdGF0ZS5maXJzdERhdGUgPSBjaGVja0RhdGVJblJhbmdlKHN0YXRlLmZpcnN0RGF0ZSwgc3RhdGUubWluRGF0ZSwgc3RhdGUubWF4RGF0ZSk7XG4gICAgICBzdGFydERhdGUgPSBzdGF0ZS5maXJzdERhdGU7XG4gICAgfVxuXG4gICAgLy8gcmVidWlsZGluZyBtb250aHNcbiAgICBpZiAoc3RhcnREYXRlKSB7XG4gICAgICBjb25zdCBmb3JjZVJlYnVpbGQgPSAnZGF5VGVtcGxhdGVEYXRhJyBpbiBwYXRjaCB8fCAnZmlyc3REYXlPZldlZWsnIGluIHBhdGNoIHx8ICdtYXJrRGlzYWJsZWQnIGluIHBhdGNoIHx8XG4gICAgICAgICAgJ21pbkRhdGUnIGluIHBhdGNoIHx8ICdtYXhEYXRlJyBpbiBwYXRjaCB8fCAnZGlzYWJsZWQnIGluIHBhdGNoIHx8ICdvdXRzaWRlRGF5cycgaW4gcGF0Y2g7XG5cbiAgICAgIGNvbnN0IG1vbnRocyA9IGJ1aWxkTW9udGhzKHRoaXMuX2NhbGVuZGFyLCBzdGFydERhdGUsIHN0YXRlLCB0aGlzLl9pMThuLCBmb3JjZVJlYnVpbGQpO1xuXG4gICAgICAvLyB1cGRhdGluZyBtb250aHMgYW5kIGJvdW5kYXJ5IGRhdGVzXG4gICAgICBzdGF0ZS5tb250aHMgPSBtb250aHM7XG4gICAgICBzdGF0ZS5maXJzdERhdGUgPSBtb250aHMubGVuZ3RoID4gMCA/IG1vbnRoc1swXS5maXJzdERhdGUgOiB1bmRlZmluZWQ7XG4gICAgICBzdGF0ZS5sYXN0RGF0ZSA9IG1vbnRocy5sZW5ndGggPiAwID8gbW9udGhzW21vbnRocy5sZW5ndGggLSAxXS5sYXN0RGF0ZSA6IHVuZGVmaW5lZDtcblxuICAgICAgLy8gcmVzZXQgc2VsZWN0ZWQgZGF0ZSBpZiAnbWFya0Rpc2FibGVkJyByZXR1cm5zIHRydWVcbiAgICAgIGlmICgnc2VsZWN0ZWREYXRlJyBpbiBwYXRjaCAmJiAhaXNEYXRlU2VsZWN0YWJsZShzdGF0ZS5zZWxlY3RlZERhdGUsIHN0YXRlKSkge1xuICAgICAgICBzdGF0ZS5zZWxlY3RlZERhdGUgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICAvLyBhZGp1c3RpbmcgZm9jdXMgYWZ0ZXIgbW9udGhzIHdlcmUgYnVpbHRcbiAgICAgIGlmICgnZmlyc3REYXRlJyBpbiBwYXRjaCkge1xuICAgICAgICBpZiAoc3RhdGUuZm9jdXNEYXRlID09PSB1bmRlZmluZWQgfHwgc3RhdGUuZm9jdXNEYXRlLmJlZm9yZShzdGF0ZS5maXJzdERhdGUpIHx8XG4gICAgICAgICAgICBzdGF0ZS5mb2N1c0RhdGUuYWZ0ZXIoc3RhdGUubGFzdERhdGUpKSB7XG4gICAgICAgICAgc3RhdGUuZm9jdXNEYXRlID0gc3RhcnREYXRlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGFkanVzdGluZyBtb250aHMveWVhcnMgZm9yIHRoZSBzZWxlY3QgYm94IG5hdmlnYXRpb25cbiAgICAgIGNvbnN0IHllYXJDaGFuZ2VkID0gIXRoaXMuX3N0YXRlLmZpcnN0RGF0ZSB8fCB0aGlzLl9zdGF0ZS5maXJzdERhdGUueWVhciAhPT0gc3RhdGUuZmlyc3REYXRlLnllYXI7XG4gICAgICBjb25zdCBtb250aENoYW5nZWQgPSAhdGhpcy5fc3RhdGUuZmlyc3REYXRlIHx8IHRoaXMuX3N0YXRlLmZpcnN0RGF0ZS5tb250aCAhPT0gc3RhdGUuZmlyc3REYXRlLm1vbnRoO1xuICAgICAgaWYgKHN0YXRlLm5hdmlnYXRpb24gPT09ICdzZWxlY3QnKSB7XG4gICAgICAgIC8vIHllYXJzIC0+ICBib3VuZGFyaWVzIChtaW4vbWF4IHdlcmUgY2hhbmdlZClcbiAgICAgICAgaWYgKCdtaW5EYXRlJyBpbiBwYXRjaCB8fCAnbWF4RGF0ZScgaW4gcGF0Y2ggfHwgc3RhdGUuc2VsZWN0Qm94ZXMueWVhcnMubGVuZ3RoID09PSAwIHx8IHllYXJDaGFuZ2VkKSB7XG4gICAgICAgICAgc3RhdGUuc2VsZWN0Qm94ZXMueWVhcnMgPSBnZW5lcmF0ZVNlbGVjdEJveFllYXJzKHN0YXRlLmZpcnN0RGF0ZSwgc3RhdGUubWluRGF0ZSwgc3RhdGUubWF4RGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtb250aHMgLT4gd2hlbiBjdXJyZW50IHllYXIgb3IgYm91bmRhcmllcyBjaGFuZ2VcbiAgICAgICAgaWYgKCdtaW5EYXRlJyBpbiBwYXRjaCB8fCAnbWF4RGF0ZScgaW4gcGF0Y2ggfHwgc3RhdGUuc2VsZWN0Qm94ZXMubW9udGhzLmxlbmd0aCA9PT0gMCB8fCB5ZWFyQ2hhbmdlZCkge1xuICAgICAgICAgIHN0YXRlLnNlbGVjdEJveGVzLm1vbnRocyA9XG4gICAgICAgICAgICAgIGdlbmVyYXRlU2VsZWN0Qm94TW9udGhzKHRoaXMuX2NhbGVuZGFyLCBzdGF0ZS5maXJzdERhdGUsIHN0YXRlLm1pbkRhdGUsIHN0YXRlLm1heERhdGUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5zZWxlY3RCb3hlcyA9IHt5ZWFyczogW10sIG1vbnRoczogW119O1xuICAgICAgfVxuXG4gICAgICAvLyB1cGRhdGluZyBuYXZpZ2F0aW9uIGFycm93cyAtPiBib3VuZGFyaWVzIGNoYW5nZSAobWluL21heCkgb3IgbW9udGgveWVhciBjaGFuZ2VzXG4gICAgICBpZiAoKHN0YXRlLm5hdmlnYXRpb24gPT09ICdhcnJvd3MnIHx8IHN0YXRlLm5hdmlnYXRpb24gPT09ICdzZWxlY3QnKSAmJlxuICAgICAgICAgIChtb250aENoYW5nZWQgfHwgeWVhckNoYW5nZWQgfHwgJ21pbkRhdGUnIGluIHBhdGNoIHx8ICdtYXhEYXRlJyBpbiBwYXRjaCB8fCAnZGlzYWJsZWQnIGluIHBhdGNoKSkge1xuICAgICAgICBzdGF0ZS5wcmV2RGlzYWJsZWQgPSBzdGF0ZS5kaXNhYmxlZCB8fCBwcmV2TW9udGhEaXNhYmxlZCh0aGlzLl9jYWxlbmRhciwgc3RhdGUuZmlyc3REYXRlLCBzdGF0ZS5taW5EYXRlKTtcbiAgICAgICAgc3RhdGUubmV4dERpc2FibGVkID0gc3RhdGUuZGlzYWJsZWQgfHwgbmV4dE1vbnRoRGlzYWJsZWQodGhpcy5fY2FsZW5kYXIsIHN0YXRlLmxhc3REYXRlLCBzdGF0ZS5tYXhEYXRlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cbiIsImV4cG9ydCBlbnVtIEtleSB7XG4gIFRhYiA9IDksXG4gIEVudGVyID0gMTMsXG4gIEVzY2FwZSA9IDI3LFxuICBTcGFjZSA9IDMyLFxuICBQYWdlVXAgPSAzMyxcbiAgUGFnZURvd24gPSAzNCxcbiAgRW5kID0gMzUsXG4gIEhvbWUgPSAzNixcbiAgQXJyb3dMZWZ0ID0gMzcsXG4gIEFycm93VXAgPSAzOCxcbiAgQXJyb3dSaWdodCA9IDM5LFxuICBBcnJvd0Rvd24gPSA0MFxufVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlclNlcnZpY2V9IGZyb20gJy4vZGF0ZXBpY2tlci1zZXJ2aWNlJztcbmltcG9ydCB7TmdiQ2FsZW5kYXJ9IGZyb20gJy4vbmdiLWNhbGVuZGFyJztcbmltcG9ydCB7dG9TdHJpbmd9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuL25nYi1kYXRlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVwaWNrZXJLZXlNYXBTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfbWluRGF0ZTogTmdiRGF0ZTtcbiAgcHJpdmF0ZSBfbWF4RGF0ZTogTmdiRGF0ZTtcbiAgcHJpdmF0ZSBfZmlyc3RWaWV3RGF0ZTogTmdiRGF0ZTtcbiAgcHJpdmF0ZSBfbGFzdFZpZXdEYXRlOiBOZ2JEYXRlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3NlcnZpY2U6IE5nYkRhdGVwaWNrZXJTZXJ2aWNlLCBwcml2YXRlIF9jYWxlbmRhcjogTmdiQ2FsZW5kYXIpIHtcbiAgICBfc2VydmljZS5tb2RlbCQuc3Vic2NyaWJlKG1vZGVsID0+IHtcbiAgICAgIHRoaXMuX21pbkRhdGUgPSBtb2RlbC5taW5EYXRlO1xuICAgICAgdGhpcy5fbWF4RGF0ZSA9IG1vZGVsLm1heERhdGU7XG4gICAgICB0aGlzLl9maXJzdFZpZXdEYXRlID0gbW9kZWwuZmlyc3REYXRlO1xuICAgICAgdGhpcy5fbGFzdFZpZXdEYXRlID0gbW9kZWwubGFzdERhdGU7XG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzS2V5KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRlcHJlY2F0aW9uXG4gICAgY29uc3Qge3doaWNofSA9IGV2ZW50O1xuICAgIGlmIChLZXlbdG9TdHJpbmcod2hpY2gpXSkge1xuICAgICAgc3dpdGNoICh3aGljaCkge1xuICAgICAgICBjYXNlIEtleS5QYWdlVXA6XG4gICAgICAgICAgdGhpcy5fc2VydmljZS5mb2N1c01vdmUoZXZlbnQuc2hpZnRLZXkgPyAneScgOiAnbScsIC0xKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXkuUGFnZURvd246XG4gICAgICAgICAgdGhpcy5fc2VydmljZS5mb2N1c01vdmUoZXZlbnQuc2hpZnRLZXkgPyAneScgOiAnbScsIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5FbmQ6XG4gICAgICAgICAgdGhpcy5fc2VydmljZS5mb2N1cyhldmVudC5zaGlmdEtleSA/IHRoaXMuX21heERhdGUgOiB0aGlzLl9sYXN0Vmlld0RhdGUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5Ib21lOlxuICAgICAgICAgIHRoaXMuX3NlcnZpY2UuZm9jdXMoZXZlbnQuc2hpZnRLZXkgPyB0aGlzLl9taW5EYXRlIDogdGhpcy5fZmlyc3RWaWV3RGF0ZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5LkFycm93TGVmdDpcbiAgICAgICAgICB0aGlzLl9zZXJ2aWNlLmZvY3VzTW92ZSgnZCcsIC0xKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXkuQXJyb3dVcDpcbiAgICAgICAgICB0aGlzLl9zZXJ2aWNlLmZvY3VzTW92ZSgnZCcsIC10aGlzLl9jYWxlbmRhci5nZXREYXlzUGVyV2VlaygpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXkuQXJyb3dSaWdodDpcbiAgICAgICAgICB0aGlzLl9zZXJ2aWNlLmZvY3VzTW92ZSgnZCcsIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5BcnJvd0Rvd246XG4gICAgICAgICAgdGhpcy5fc2VydmljZS5mb2N1c01vdmUoJ2QnLCB0aGlzLl9jYWxlbmRhci5nZXREYXlzUGVyV2VlaygpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXkuRW50ZXI6XG4gICAgICAgIGNhc2UgS2V5LlNwYWNlOlxuICAgICAgICAgIHRoaXMuX3NlcnZpY2UuZm9jdXNTZWxlY3QoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcbmltcG9ydCB7RGF5VGVtcGxhdGVDb250ZXh0fSBmcm9tICcuL2RhdGVwaWNrZXItZGF5LXRlbXBsYXRlLWNvbnRleHQnO1xuXG5leHBvcnQgdHlwZSBOZ2JNYXJrRGlzYWJsZWQgPSAoZGF0ZTogTmdiRGF0ZVN0cnVjdCwgY3VycmVudDoge3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn0pID0+IGJvb2xlYW47XG5leHBvcnQgdHlwZSBOZ2JEYXlUZW1wbGF0ZURhdGEgPSAoZGF0ZTogTmdiRGF0ZVN0cnVjdCwgY3VycmVudDoge3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn0pID0+IGFueTtcblxuZXhwb3J0IHR5cGUgRGF5Vmlld01vZGVsID0ge1xuICBkYXRlOiBOZ2JEYXRlLFxuICBjb250ZXh0OiBEYXlUZW1wbGF0ZUNvbnRleHQsXG4gIHRhYmluZGV4OiBudW1iZXIsXG4gIGFyaWFMYWJlbDogc3RyaW5nLFxuICBoaWRkZW46IGJvb2xlYW5cbn07XG5cbmV4cG9ydCB0eXBlIFdlZWtWaWV3TW9kZWwgPSB7XG4gIG51bWJlcjogbnVtYmVyLFxuICBkYXlzOiBEYXlWaWV3TW9kZWxbXSxcbiAgY29sbGFwc2VkOiBib29sZWFuXG59O1xuXG5leHBvcnQgdHlwZSBNb250aFZpZXdNb2RlbCA9IHtcbiAgZmlyc3REYXRlOiBOZ2JEYXRlLFxuICBsYXN0RGF0ZTogTmdiRGF0ZSxcbiAgbnVtYmVyOiBudW1iZXIsXG4gIHllYXI6IG51bWJlcixcbiAgd2Vla3M6IFdlZWtWaWV3TW9kZWxbXSxcbiAgd2Vla2RheXM6IG51bWJlcltdXG59O1xuXG4vLyBjbGFuZy1mb3JtYXQgb2ZmXG5leHBvcnQgdHlwZSBEYXRlcGlja2VyVmlld01vZGVsID0ge1xuICBkYXlUZW1wbGF0ZURhdGE/OiBOZ2JEYXlUZW1wbGF0ZURhdGEsXG4gIGRpc2FibGVkOiBib29sZWFuLFxuICBkaXNwbGF5TW9udGhzOiBudW1iZXIsXG4gIGZpcnN0RGF0ZT86IE5nYkRhdGUsXG4gIGZpcnN0RGF5T2ZXZWVrOiBudW1iZXIsXG4gIGZvY3VzRGF0ZT86IE5nYkRhdGUsXG4gIGZvY3VzVmlzaWJsZTogYm9vbGVhbixcbiAgbGFzdERhdGU/OiBOZ2JEYXRlLFxuICBtYXJrRGlzYWJsZWQ/OiBOZ2JNYXJrRGlzYWJsZWQsXG4gIG1heERhdGU/OiBOZ2JEYXRlLFxuICBtaW5EYXRlPzogTmdiRGF0ZSxcbiAgbW9udGhzOiBNb250aFZpZXdNb2RlbFtdLFxuICBuYXZpZ2F0aW9uOiAnc2VsZWN0JyB8ICdhcnJvd3MnIHwgJ25vbmUnLFxuICBvdXRzaWRlRGF5czogJ3Zpc2libGUnIHwgJ2NvbGxhcHNlZCcgfCAnaGlkZGVuJyxcbiAgcHJldkRpc2FibGVkOiBib29sZWFuLFxuICBuZXh0RGlzYWJsZWQ6IGJvb2xlYW4sXG4gIHNlbGVjdEJveGVzOiB7XG4gICAgeWVhcnM6IG51bWJlcltdLFxuICAgIG1vbnRoczogbnVtYmVyW11cbiAgfSxcbiAgc2VsZWN0ZWREYXRlOiBOZ2JEYXRlXG59O1xuLy8gY2xhbmctZm9ybWF0IG9uXG5cbmV4cG9ydCBlbnVtIE5hdmlnYXRpb25FdmVudCB7XG4gIFBSRVYsXG4gIE5FWFRcbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZSwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEYXlUZW1wbGF0ZUNvbnRleHR9IGZyb20gJy4vZGF0ZXBpY2tlci1kYXktdGVtcGxhdGUtY29udGV4dCc7XG5pbXBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHNlcnZpY2UgZm9yIHRoZSBOZ2JEYXRlcGlja2VyIGNvbXBvbmVudC5cbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSBkYXRlcGlja2VycyB1c2VkIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlckNvbmZpZyB7XG4gIGRheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxEYXlUZW1wbGF0ZUNvbnRleHQ+O1xuICBkYXlUZW1wbGF0ZURhdGE6IChkYXRlOiBOZ2JEYXRlU3RydWN0LCBjdXJyZW50OiB7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfSkgPT4gYW55O1xuICBmb290ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgZGlzcGxheU1vbnRocyA9IDE7XG4gIGZpcnN0RGF5T2ZXZWVrID0gMTtcbiAgbWFya0Rpc2FibGVkOiAoZGF0ZTogTmdiRGF0ZVN0cnVjdCwgY3VycmVudDoge3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn0pID0+IGJvb2xlYW47XG4gIG1pbkRhdGU6IE5nYkRhdGVTdHJ1Y3Q7XG4gIG1heERhdGU6IE5nYkRhdGVTdHJ1Y3Q7XG4gIG5hdmlnYXRpb246ICdzZWxlY3QnIHwgJ2Fycm93cycgfCAnbm9uZScgPSAnc2VsZWN0JztcbiAgb3V0c2lkZURheXM6ICd2aXNpYmxlJyB8ICdjb2xsYXBzZWQnIHwgJ2hpZGRlbicgPSAndmlzaWJsZSc7XG4gIHNob3dXZWVrZGF5cyA9IHRydWU7XG4gIHNob3dXZWVrTnVtYmVycyA9IGZhbHNlO1xuICBzdGFydERhdGU6IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9O1xufVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi4vbmdiLWRhdGUtc3RydWN0JztcbmltcG9ydCB7aXNJbnRlZ2VyfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gTkdCX0RBVEVQSUNLRVJfREFURV9BREFQVEVSX0ZBQ1RPUlkoKSB7XG4gIHJldHVybiBuZXcgTmdiRGF0ZVN0cnVjdEFkYXB0ZXIoKTtcbn1cblxuLyoqXG4gKiBBbiBhYnN0cmFjdCBjbGFzcyB1c2VkIGFzIHRoZSBESSB0b2tlbiB0aGF0IGRvZXMgY29udmVyc2lvbiBiZXR3ZWVuIHRoZSBpbnRlcm5hbFxuICogZGF0ZXBpY2tlciBOZ2JEYXRlU3RydWN0IG1vZGVsIGFuZCBhbnkgcHJvdmlkZWQgdXNlciBkYXRlIG1vZGVsLCBleC4gc3RyaW5nLCBuYXRpdmUgZGF0ZSwgZXRjLlxuICpcbiAqIEFkYXB0ZXIgaXMgdXNlZCBmb3IgY29udmVyc2lvbiB3aGVuIGJpbmRpbmcgZGF0ZXBpY2tlciB0byBhIG1vZGVsIHdpdGggZm9ybXMsIGV4LiBbKG5nTW9kZWwpXT1cInVzZXJEYXRlTW9kZWxcIlxuICpcbiAqIERlZmF1bHQgaW1wbGVtZW50YXRpb24gYXNzdW1lcyBOZ2JEYXRlU3RydWN0IGZvciB1c2VyIG1vZGVsIGFzIHdlbGwuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCcsIHVzZUZhY3Rvcnk6IE5HQl9EQVRFUElDS0VSX0RBVEVfQURBUFRFUl9GQUNUT1JZfSlcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOZ2JEYXRlQWRhcHRlcjxEPiB7XG4gIC8qKlxuICAgKiBDb252ZXJ0cyB1c2VyLW1vZGVsIGRhdGUgaW50byBhbiBOZ2JEYXRlU3RydWN0IGZvciBpbnRlcm5hbCB1c2UgaW4gdGhlIGxpYnJhcnlcbiAgICovXG4gIGFic3RyYWN0IGZyb21Nb2RlbCh2YWx1ZTogRCk6IE5nYkRhdGVTdHJ1Y3Q7XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGludGVybmFsIGRhdGUgdmFsdWUgTmdiRGF0ZVN0cnVjdCB0byB1c2VyLW1vZGVsIGRhdGVcbiAgICogVGhlIHJldHVybmVkIHR5cGUgaXMgc3VwcG9zZWQgdG8gYmUgb2YgdGhlIHNhbWUgdHlwZSBhcyBmcm9tTW9kZWwoKSBpbnB1dC12YWx1ZSBwYXJhbVxuICAgKi9cbiAgYWJzdHJhY3QgdG9Nb2RlbChkYXRlOiBOZ2JEYXRlU3RydWN0KTogRDtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVTdHJ1Y3RBZGFwdGVyIGV4dGVuZHMgTmdiRGF0ZUFkYXB0ZXI8TmdiRGF0ZVN0cnVjdD4ge1xuICAvKipcbiAgICogQ29udmVydHMgYSBOZ2JEYXRlU3RydWN0IHZhbHVlIGludG8gTmdiRGF0ZVN0cnVjdCB2YWx1ZVxuICAgKi9cbiAgZnJvbU1vZGVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBOZ2JEYXRlU3RydWN0IHtcbiAgICByZXR1cm4gKGRhdGUgJiYgaXNJbnRlZ2VyKGRhdGUueWVhcikgJiYgaXNJbnRlZ2VyKGRhdGUubW9udGgpICYmIGlzSW50ZWdlcihkYXRlLmRheSkpID9cbiAgICAgICAge3llYXI6IGRhdGUueWVhciwgbW9udGg6IGRhdGUubW9udGgsIGRheTogZGF0ZS5kYXl9IDpcbiAgICAgICAgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIE5nYkRhdGVTdHJ1Y3QgdmFsdWUgaW50byBOZ2JEYXRlU3RydWN0IHZhbHVlXG4gICAqL1xuICB0b01vZGVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBOZ2JEYXRlU3RydWN0IHtcbiAgICByZXR1cm4gKGRhdGUgJiYgaXNJbnRlZ2VyKGRhdGUueWVhcikgJiYgaXNJbnRlZ2VyKGRhdGUubW9udGgpICYmIGlzSW50ZWdlcihkYXRlLmRheSkpID9cbiAgICAgICAge3llYXI6IGRhdGUueWVhciwgbW9udGg6IGRhdGUubW9udGgsIGRheTogZGF0ZS5kYXl9IDpcbiAgICAgICAgbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIGZvcndhcmRSZWYsXG4gIE9uSW5pdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgRXZlbnRFbWl0dGVyLFxuICBPdXRwdXQsXG4gIE9uRGVzdHJveSxcbiAgRWxlbWVudFJlZixcbiAgTmdab25lLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge05nYkNhbGVuZGFyfSBmcm9tICcuL25nYi1jYWxlbmRhcic7XG5pbXBvcnQge05nYkRhdGV9IGZyb20gJy4vbmdiLWRhdGUnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyU2VydmljZX0gZnJvbSAnLi9kYXRlcGlja2VyLXNlcnZpY2UnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyS2V5TWFwU2VydmljZX0gZnJvbSAnLi9kYXRlcGlja2VyLWtleW1hcC1zZXJ2aWNlJztcbmltcG9ydCB7RGF0ZXBpY2tlclZpZXdNb2RlbCwgTmF2aWdhdGlvbkV2ZW50fSBmcm9tICcuL2RhdGVwaWNrZXItdmlldy1tb2RlbCc7XG5pbXBvcnQge0RheVRlbXBsYXRlQ29udGV4dH0gZnJvbSAnLi9kYXRlcGlja2VyLWRheS10ZW1wbGF0ZS1jb250ZXh0JztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlckNvbmZpZ30gZnJvbSAnLi9kYXRlcGlja2VyLWNvbmZpZyc7XG5pbXBvcnQge05nYkRhdGVBZGFwdGVyfSBmcm9tICcuL2FkYXB0ZXJzL25nYi1kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHtOZ2JEYXRlU3RydWN0fSBmcm9tICcuL25nYi1kYXRlLXN0cnVjdCc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJJMThufSBmcm9tICcuL2RhdGVwaWNrZXItaTE4bic7XG5pbXBvcnQge2lzQ2hhbmdlZERhdGV9IGZyb20gJy4vZGF0ZXBpY2tlci10b29scyc7XG5cbmNvbnN0IE5HQl9EQVRFUElDS0VSX1ZBTFVFX0FDQ0VTU09SID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiRGF0ZXBpY2tlciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIFRoZSBwYXlsb2FkIG9mIHRoZSBkYXRlcGlja2VyIG5hdmlnYXRpb24gZXZlbnRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudCB7XG4gIC8qKlxuICAgKiBDdXJyZW50bHkgZGlzcGxheWVkIG1vbnRoXG4gICAqL1xuICBjdXJyZW50OiB7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfTtcblxuICAvKipcbiAgICogTW9udGggd2UncmUgbmF2aWdhdGluZyB0b1xuICAgKi9cbiAgbmV4dDoge3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn07XG59XG5cbi8qKlxuICogQSBsaWdodHdlaWdodCBhbmQgaGlnaGx5IGNvbmZpZ3VyYWJsZSBkYXRlcGlja2VyIGRpcmVjdGl2ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgZXhwb3J0QXM6ICduZ2JEYXRlcGlja2VyJyxcbiAgc2VsZWN0b3I6ICduZ2ItZGF0ZXBpY2tlcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzdHlsZVVybHM6IFsnLi9kYXRlcGlja2VyLnNjc3MnXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGUgI2R0IGxldC1kYXRlPVwiZGF0ZVwiIGxldC1jdXJyZW50TW9udGg9XCJjdXJyZW50TW9udGhcIiBsZXQtc2VsZWN0ZWQ9XCJzZWxlY3RlZFwiIGxldC1kaXNhYmxlZD1cImRpc2FibGVkXCIgbGV0LWZvY3VzZWQ9XCJmb2N1c2VkXCI+XG4gICAgICA8ZGl2IG5nYkRhdGVwaWNrZXJEYXlWaWV3XG4gICAgICAgIFtkYXRlXT1cImRhdGVcIlxuICAgICAgICBbY3VycmVudE1vbnRoXT1cImN1cnJlbnRNb250aFwiXG4gICAgICAgIFtzZWxlY3RlZF09XCJzZWxlY3RlZFwiXG4gICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgIFtmb2N1c2VkXT1cImZvY3VzZWRcIj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG5cbiAgICA8ZGl2IGNsYXNzPVwibmdiLWRwLWhlYWRlciBiZy1saWdodFwiPlxuICAgICAgPG5nYi1kYXRlcGlja2VyLW5hdmlnYXRpb24gKm5nSWY9XCJuYXZpZ2F0aW9uICE9PSAnbm9uZSdcIlxuICAgICAgICBbZGF0ZV09XCJtb2RlbC5maXJzdERhdGVcIlxuICAgICAgICBbbW9udGhzXT1cIm1vZGVsLm1vbnRoc1wiXG4gICAgICAgIFtkaXNhYmxlZF09XCJtb2RlbC5kaXNhYmxlZFwiXG4gICAgICAgIFtzaG93U2VsZWN0XT1cIm1vZGVsLm5hdmlnYXRpb24gPT09ICdzZWxlY3QnXCJcbiAgICAgICAgW3ByZXZEaXNhYmxlZF09XCJtb2RlbC5wcmV2RGlzYWJsZWRcIlxuICAgICAgICBbbmV4dERpc2FibGVkXT1cIm1vZGVsLm5leHREaXNhYmxlZFwiXG4gICAgICAgIFtzZWxlY3RCb3hlc109XCJtb2RlbC5zZWxlY3RCb3hlc1wiXG4gICAgICAgIChuYXZpZ2F0ZSk9XCJvbk5hdmlnYXRlRXZlbnQoJGV2ZW50KVwiXG4gICAgICAgIChzZWxlY3QpPVwib25OYXZpZ2F0ZURhdGVTZWxlY3QoJGV2ZW50KVwiPlxuICAgICAgPC9uZ2ItZGF0ZXBpY2tlci1uYXZpZ2F0aW9uPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cIm5nYi1kcC1tb250aHNcIiAoa2V5ZG93bik9XCJvbktleURvd24oJGV2ZW50KVwiIChmb2N1c2luKT1cInNob3dGb2N1cyh0cnVlKVwiIChmb2N1c291dCk9XCJzaG93Rm9jdXMoZmFsc2UpXCI+XG4gICAgICA8bmctdGVtcGxhdGUgbmdGb3IgbGV0LW1vbnRoIFtuZ0Zvck9mXT1cIm1vZGVsLm1vbnRoc1wiIGxldC1pPVwiaW5kZXhcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5nYi1kcC1tb250aFwiPlxuICAgICAgICAgIDxkaXYgKm5nSWY9XCJuYXZpZ2F0aW9uID09PSAnbm9uZScgfHwgKGRpc3BsYXlNb250aHMgPiAxICYmIG5hdmlnYXRpb24gPT09ICdzZWxlY3QnKVwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJuZ2ItZHAtbW9udGgtbmFtZSBiZy1saWdodFwiPlxuICAgICAgICAgICAge3sgaTE4bi5nZXRNb250aEZ1bGxOYW1lKG1vbnRoLm51bWJlciwgbW9udGgueWVhcikgfX0ge3sgaTE4bi5nZXRZZWFyTnVtZXJhbHMobW9udGgueWVhcikgfX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8bmdiLWRhdGVwaWNrZXItbW9udGgtdmlld1xuICAgICAgICAgICAgW21vbnRoXT1cIm1vbnRoXCJcbiAgICAgICAgICAgIFtkYXlUZW1wbGF0ZV09XCJkYXlUZW1wbGF0ZSB8fCBkdFwiXG4gICAgICAgICAgICBbc2hvd1dlZWtkYXlzXT1cInNob3dXZWVrZGF5c1wiXG4gICAgICAgICAgICBbc2hvd1dlZWtOdW1iZXJzXT1cInNob3dXZWVrTnVtYmVyc1wiXG4gICAgICAgICAgICAoc2VsZWN0KT1cIm9uRGF0ZVNlbGVjdCgkZXZlbnQpXCI+XG4gICAgICAgICAgPC9uZ2ItZGF0ZXBpY2tlci1tb250aC12aWV3PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG5cbiAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9vdGVyVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICBgLFxuICBwcm92aWRlcnM6IFtOR0JfREFURVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUiwgTmdiRGF0ZXBpY2tlclNlcnZpY2UsIE5nYkRhdGVwaWNrZXJLZXlNYXBTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyIGltcGxlbWVudHMgT25EZXN0cm95LFxuICAgIE9uQ2hhbmdlcywgT25Jbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIG1vZGVsOiBEYXRlcGlja2VyVmlld01vZGVsO1xuXG4gIHByaXZhdGUgX2NvbnRyb2xWYWx1ZTogTmdiRGF0ZTtcbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX3NlbGVjdFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICAvKipcbiAgICogUmVmZXJlbmNlIGZvciB0aGUgY3VzdG9tIHRlbXBsYXRlIGZvciB0aGUgZGF5IGRpc3BsYXlcbiAgICovXG4gIEBJbnB1dCgpIGRheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxEYXlUZW1wbGF0ZUNvbnRleHQ+O1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byBwYXNzIGFueSBhcmJpdHJhcnkgZGF0YSB0byB0aGUgY3VzdG9tIGRheSB0ZW1wbGF0ZSBjb250ZXh0XG4gICAqICdDdXJyZW50JyBjb250YWlucyB0aGUgbW9udGggdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBpbiB0aGUgdmlld1xuICAgKlxuICAgKiBAc2luY2UgMy4zLjBcbiAgICovXG4gIEBJbnB1dCgpIGRheVRlbXBsYXRlRGF0YTogKGRhdGU6IE5nYkRhdGUsIGN1cnJlbnQ6IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9KSA9PiBhbnk7XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiBtb250aHMgdG8gZGlzcGxheVxuICAgKi9cbiAgQElucHV0KCkgZGlzcGxheU1vbnRoczogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBGaXJzdCBkYXkgb2YgdGhlIHdlZWsuIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICd3ZWVrZGF5JyBpcyAxPU1vbiAuLi4gNz1TdW5cbiAgICovXG4gIEBJbnB1dCgpIGZpcnN0RGF5T2ZXZWVrOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSBmb3IgdGhlIGN1c3RvbSB0ZW1wbGF0ZSBmb3IgdGhlIGZvb3RlclxuICAgKlxuICAgKiBAc2luY2UgMy4zLjBcbiAgICovXG4gIEBJbnB1dCgpIGZvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byBtYXJrIGEgZ2l2ZW4gZGF0ZSBhcyBkaXNhYmxlZC5cbiAgICogJ0N1cnJlbnQnIGNvbnRhaW5zIHRoZSBtb250aCB0aGF0IHdpbGwgYmUgZGlzcGxheWVkIGluIHRoZSB2aWV3XG4gICAqL1xuICBASW5wdXQoKSBtYXJrRGlzYWJsZWQ6IChkYXRlOiBOZ2JEYXRlLCBjdXJyZW50OiB7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfSkgPT4gYm9vbGVhbjtcblxuICAvKipcbiAgICogTWF4IGRhdGUgZm9yIHRoZSBuYXZpZ2F0aW9uLiBJZiBub3QgcHJvdmlkZWQsICd5ZWFyJyBzZWxlY3QgYm94IHdpbGwgZGlzcGxheSAxMCB5ZWFycyBhZnRlciBjdXJyZW50IG1vbnRoXG4gICAqL1xuICBASW5wdXQoKSBtYXhEYXRlOiBOZ2JEYXRlU3RydWN0O1xuXG4gIC8qKlxuICAgKiBNaW4gZGF0ZSBmb3IgdGhlIG5hdmlnYXRpb24uIElmIG5vdCBwcm92aWRlZCwgJ3llYXInIHNlbGVjdCBib3ggd2lsbCBkaXNwbGF5IDEwIHllYXJzIGJlZm9yZSBjdXJyZW50IG1vbnRoXG4gICAqL1xuICBASW5wdXQoKSBtaW5EYXRlOiBOZ2JEYXRlU3RydWN0O1xuXG4gIC8qKlxuICAgKiBOYXZpZ2F0aW9uIHR5cGU6IGBzZWxlY3RgIChkZWZhdWx0IHdpdGggc2VsZWN0IGJveGVzIGZvciBtb250aCBhbmQgeWVhciksIGBhcnJvd3NgXG4gICAqICh3aXRob3V0IHNlbGVjdCBib3hlcywgb25seSBuYXZpZ2F0aW9uIGFycm93cykgb3IgYG5vbmVgIChubyBuYXZpZ2F0aW9uIGF0IGFsbClcbiAgICovXG4gIEBJbnB1dCgpIG5hdmlnYXRpb246ICdzZWxlY3QnIHwgJ2Fycm93cycgfCAnbm9uZSc7XG5cbiAgLyoqXG4gICAqIFRoZSB3YXkgdG8gZGlzcGxheSBkYXlzIHRoYXQgZG9uJ3QgYmVsb25nIHRvIGN1cnJlbnQgbW9udGg6IGB2aXNpYmxlYCAoZGVmYXVsdCksXG4gICAqIGBoaWRkZW5gIChub3QgZGlzcGxheWVkKSBvciBgY29sbGFwc2VkYCAobm90IGRpc3BsYXllZCB3aXRoIGVtcHR5IHNwYWNlIGNvbGxhcHNlZClcbiAgICovXG4gIEBJbnB1dCgpIG91dHNpZGVEYXlzOiAndmlzaWJsZScgfCAnY29sbGFwc2VkJyB8ICdoaWRkZW4nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc3BsYXkgZGF5cyBvZiB0aGUgd2Vla1xuICAgKi9cbiAgQElucHV0KCkgc2hvd1dlZWtkYXlzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc3BsYXkgd2VlayBudW1iZXJzXG4gICAqL1xuICBASW5wdXQoKSBzaG93V2Vla051bWJlcnM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIERhdGUgdG8gb3BlbiBjYWxlbmRhciB3aXRoLlxuICAgKiBXaXRoIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnbW9udGgnIGlzIDE9SmFuIC4uLiAxMj1EZWMuXG4gICAqIElmIG5vdGhpbmcgb3IgaW52YWxpZCBkYXRlIHByb3ZpZGVkLCBjYWxlbmRhciB3aWxsIG9wZW4gd2l0aCBjdXJyZW50IG1vbnRoLlxuICAgKiBVc2UgJ25hdmlnYXRlVG8oZGF0ZSknIGFzIGFuIGFsdGVybmF0aXZlXG4gICAqL1xuICBASW5wdXQoKSBzdGFydERhdGU6IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXIsIGRheT86IG51bWJlcn07XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGZpcmVkIHdoZW4gbmF2aWdhdGlvbiBoYXBwZW5zIGFuZCBjdXJyZW50bHkgZGlzcGxheWVkIG1vbnRoIGNoYW5nZXMuXG4gICAqIFNlZSBOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudCBmb3IgdGhlIHBheWxvYWQgaW5mby5cbiAgICovXG4gIEBPdXRwdXQoKSBuYXZpZ2F0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiRGF0ZXBpY2tlck5hdmlnYXRlRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGZpcmVkIHdoZW4gdXNlciBzZWxlY3RzIGEgZGF0ZSB1c2luZyBrZXlib2FyZCBvciBtb3VzZS5cbiAgICogVGhlIHBheWxvYWQgb2YgdGhlIGV2ZW50IGlzIGN1cnJlbnRseSBzZWxlY3RlZCBOZ2JEYXRlLlxuICAgKi9cbiAgQE91dHB1dCgpIHNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiRGF0ZT4oKTtcblxuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2tleU1hcFNlcnZpY2U6IE5nYkRhdGVwaWNrZXJLZXlNYXBTZXJ2aWNlLCBwdWJsaWMgX3NlcnZpY2U6IE5nYkRhdGVwaWNrZXJTZXJ2aWNlLFxuICAgICAgcHJpdmF0ZSBfY2FsZW5kYXI6IE5nYkNhbGVuZGFyLCBwdWJsaWMgaTE4bjogTmdiRGF0ZXBpY2tlckkxOG4sIGNvbmZpZzogTmdiRGF0ZXBpY2tlckNvbmZpZyxcbiAgICAgIHByaXZhdGUgX2NkOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICBwcml2YXRlIF9uZ2JEYXRlQWRhcHRlcjogTmdiRGF0ZUFkYXB0ZXI8YW55PiwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHtcbiAgICBbJ2RheVRlbXBsYXRlJywgJ2RheVRlbXBsYXRlRGF0YScsICdkaXNwbGF5TW9udGhzJywgJ2ZpcnN0RGF5T2ZXZWVrJywgJ2Zvb3RlclRlbXBsYXRlJywgJ21hcmtEaXNhYmxlZCcsICdtaW5EYXRlJyxcbiAgICAgJ21heERhdGUnLCAnbmF2aWdhdGlvbicsICdvdXRzaWRlRGF5cycsICdzaG93V2Vla2RheXMnLCAnc2hvd1dlZWtOdW1iZXJzJywgJ3N0YXJ0RGF0ZSddXG4gICAgICAgIC5mb3JFYWNoKGlucHV0ID0+IHRoaXNbaW5wdXRdID0gY29uZmlnW2lucHV0XSk7XG5cbiAgICB0aGlzLl9zZWxlY3RTdWJzY3JpcHRpb24gPSBfc2VydmljZS5zZWxlY3QkLnN1YnNjcmliZShkYXRlID0+IHsgdGhpcy5zZWxlY3QuZW1pdChkYXRlKTsgfSk7XG5cbiAgICB0aGlzLl9zdWJzY3JpcHRpb24gPSBfc2VydmljZS5tb2RlbCQuc3Vic2NyaWJlKG1vZGVsID0+IHtcbiAgICAgIGNvbnN0IG5ld0RhdGUgPSBtb2RlbC5maXJzdERhdGU7XG4gICAgICBjb25zdCBvbGREYXRlID0gdGhpcy5tb2RlbCA/IHRoaXMubW9kZWwuZmlyc3REYXRlIDogbnVsbDtcbiAgICAgIGNvbnN0IG5ld1NlbGVjdGVkRGF0ZSA9IG1vZGVsLnNlbGVjdGVkRGF0ZTtcbiAgICAgIGNvbnN0IG5ld0ZvY3VzZWREYXRlID0gbW9kZWwuZm9jdXNEYXRlO1xuICAgICAgY29uc3Qgb2xkRm9jdXNlZERhdGUgPSB0aGlzLm1vZGVsID8gdGhpcy5tb2RlbC5mb2N1c0RhdGUgOiBudWxsO1xuXG4gICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG5cbiAgICAgIC8vIGhhbmRsaW5nIHNlbGVjdGlvbiBjaGFuZ2VcbiAgICAgIGlmIChpc0NoYW5nZWREYXRlKG5ld1NlbGVjdGVkRGF0ZSwgdGhpcy5fY29udHJvbFZhbHVlKSkge1xuICAgICAgICB0aGlzLl9jb250cm9sVmFsdWUgPSBuZXdTZWxlY3RlZERhdGU7XG4gICAgICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gICAgICAgIHRoaXMub25DaGFuZ2UodGhpcy5fbmdiRGF0ZUFkYXB0ZXIudG9Nb2RlbChuZXdTZWxlY3RlZERhdGUpKTtcbiAgICAgIH1cblxuICAgICAgLy8gaGFuZGxpbmcgZm9jdXMgY2hhbmdlXG4gICAgICBpZiAoaXNDaGFuZ2VkRGF0ZShuZXdGb2N1c2VkRGF0ZSwgb2xkRm9jdXNlZERhdGUpICYmIG9sZEZvY3VzZWREYXRlICYmIG1vZGVsLmZvY3VzVmlzaWJsZSkge1xuICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGVtaXR0aW5nIG5hdmlnYXRpb24gZXZlbnQgaWYgdGhlIGZpcnN0IG1vbnRoIGNoYW5nZXNcbiAgICAgIGlmICghbmV3RGF0ZS5lcXVhbHMob2xkRGF0ZSkpIHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZS5lbWl0KHtcbiAgICAgICAgICBjdXJyZW50OiBvbGREYXRlID8ge3llYXI6IG9sZERhdGUueWVhciwgbW9udGg6IG9sZERhdGUubW9udGh9IDogbnVsbCxcbiAgICAgICAgICBuZXh0OiB7eWVhcjogbmV3RGF0ZS55ZWFyLCBtb250aDogbmV3RGF0ZS5tb250aH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBfY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTWFudWFsbHkgZm9jdXMgdGhlIGZvY3VzYWJsZSBkYXkgaW4gdGhlIGRhdGVwaWNrZXJcbiAgICovXG4gIGZvY3VzKCkge1xuICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50VG9Gb2N1cyA9XG4gICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KCdkaXYubmdiLWRwLWRheVt0YWJpbmRleD1cIjBcIl0nKTtcbiAgICAgIGlmIChlbGVtZW50VG9Gb2N1cykge1xuICAgICAgICBlbGVtZW50VG9Gb2N1cy5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlcyBjdXJyZW50IHZpZXcgdG8gcHJvdmlkZWQgZGF0ZS5cbiAgICogV2l0aCBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMTogJ21vbnRoJyBpcyAxPUphbiAuLi4gMTI9RGVjLlxuICAgKiBJZiBub3RoaW5nIG9yIGludmFsaWQgZGF0ZSBwcm92aWRlZCBjYWxlbmRhciB3aWxsIG9wZW4gY3VycmVudCBtb250aC5cbiAgICogVXNlICdzdGFydERhdGUnIGlucHV0IGFzIGFuIGFsdGVybmF0aXZlXG4gICAqL1xuICBuYXZpZ2F0ZVRvKGRhdGU/OiB7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyLCBkYXk/OiBudW1iZXJ9KSB7XG4gICAgdGhpcy5fc2VydmljZS5vcGVuKE5nYkRhdGUuZnJvbShkYXRlID8gZGF0ZS5kYXkgPyBkYXRlIGFzIE5nYkRhdGVTdHJ1Y3QgOiB7Li4uZGF0ZSwgZGF5OiAxfSA6IG51bGwpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3NlbGVjdFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMubW9kZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgWydkYXlUZW1wbGF0ZURhdGEnLCAnZGlzcGxheU1vbnRocycsICdtYXJrRGlzYWJsZWQnLCAnZmlyc3REYXlPZldlZWsnLCAnbmF2aWdhdGlvbicsICdtaW5EYXRlJywgJ21heERhdGUnLFxuICAgICAgICdvdXRzaWRlRGF5cyddXG4gICAgICAgICAgLmZvckVhY2goaW5wdXQgPT4gdGhpcy5fc2VydmljZVtpbnB1dF0gPSB0aGlzW2lucHV0XSk7XG4gICAgICB0aGlzLm5hdmlnYXRlVG8odGhpcy5zdGFydERhdGUpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBbJ2RheVRlbXBsYXRlRGF0YScsICdkaXNwbGF5TW9udGhzJywgJ21hcmtEaXNhYmxlZCcsICdmaXJzdERheU9mV2VlaycsICduYXZpZ2F0aW9uJywgJ21pbkRhdGUnLCAnbWF4RGF0ZScsXG4gICAgICdvdXRzaWRlRGF5cyddXG4gICAgICAgIC5maWx0ZXIoaW5wdXQgPT4gaW5wdXQgaW4gY2hhbmdlcylcbiAgICAgICAgLmZvckVhY2goaW5wdXQgPT4gdGhpcy5fc2VydmljZVtpbnB1dF0gPSB0aGlzW2lucHV0XSk7XG5cbiAgICBpZiAoJ3N0YXJ0RGF0ZScgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5uYXZpZ2F0ZVRvKHRoaXMuc3RhcnREYXRlKTtcbiAgICB9XG4gIH1cblxuICBvbkRhdGVTZWxlY3QoZGF0ZTogTmdiRGF0ZSkge1xuICAgIHRoaXMuX3NlcnZpY2UuZm9jdXMoZGF0ZSk7XG4gICAgdGhpcy5fc2VydmljZS5zZWxlY3QoZGF0ZSwge2VtaXRFdmVudDogdHJ1ZX0pO1xuICB9XG5cbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7IHRoaXMuX2tleU1hcFNlcnZpY2UucHJvY2Vzc0tleShldmVudCk7IH1cblxuICBvbk5hdmlnYXRlRGF0ZVNlbGVjdChkYXRlOiBOZ2JEYXRlKSB7IHRoaXMuX3NlcnZpY2Uub3BlbihkYXRlKTsgfVxuXG4gIG9uTmF2aWdhdGVFdmVudChldmVudDogTmF2aWdhdGlvbkV2ZW50KSB7XG4gICAgc3dpdGNoIChldmVudCkge1xuICAgICAgY2FzZSBOYXZpZ2F0aW9uRXZlbnQuUFJFVjpcbiAgICAgICAgdGhpcy5fc2VydmljZS5vcGVuKHRoaXMuX2NhbGVuZGFyLmdldFByZXYodGhpcy5tb2RlbC5maXJzdERhdGUsICdtJywgMSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTmF2aWdhdGlvbkV2ZW50Lk5FWFQ6XG4gICAgICAgIHRoaXMuX3NlcnZpY2Uub3Blbih0aGlzLl9jYWxlbmRhci5nZXROZXh0KHRoaXMubW9kZWwuZmlyc3REYXRlLCAnbScsIDEpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uQ2hhbmdlID0gZm47IH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gYW55KTogdm9pZCB7IHRoaXMub25Ub3VjaGVkID0gZm47IH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHsgdGhpcy5fc2VydmljZS5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7IH1cblxuICBzaG93Rm9jdXMoZm9jdXNWaXNpYmxlOiBib29sZWFuKSB7IHRoaXMuX3NlcnZpY2UuZm9jdXNWaXNpYmxlID0gZm9jdXNWaXNpYmxlOyB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZSA9IE5nYkRhdGUuZnJvbSh0aGlzLl9uZ2JEYXRlQWRhcHRlci5mcm9tTW9kZWwodmFsdWUpKTtcbiAgICB0aGlzLl9zZXJ2aWNlLnNlbGVjdCh0aGlzLl9jb250cm9sVmFsdWUpO1xuICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIFRlbXBsYXRlUmVmLCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNb250aFZpZXdNb2RlbCwgRGF5Vmlld01vZGVsfSBmcm9tICcuL2RhdGVwaWNrZXItdmlldy1tb2RlbCc7XG5pbXBvcnQge05nYkRhdGV9IGZyb20gJy4vbmdiLWRhdGUnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VySTE4bn0gZnJvbSAnLi9kYXRlcGlja2VyLWkxOG4nO1xuaW1wb3J0IHtEYXlUZW1wbGF0ZUNvbnRleHR9IGZyb20gJy4vZGF0ZXBpY2tlci1kYXktdGVtcGxhdGUtY29udGV4dCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1kYXRlcGlja2VyLW1vbnRoLXZpZXcnLFxuICBob3N0OiB7J3JvbGUnOiAnZ3JpZCd9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzdHlsZVVybHM6IFsnLi9kYXRlcGlja2VyLW1vbnRoLXZpZXcuc2NzcyddLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgKm5nSWY9XCJzaG93V2Vla2RheXNcIiBjbGFzcz1cIm5nYi1kcC13ZWVrIG5nYi1kcC13ZWVrZGF5cyBiZy1saWdodFwiPlxuICAgICAgPGRpdiAqbmdJZj1cInNob3dXZWVrTnVtYmVyc1wiIGNsYXNzPVwibmdiLWRwLXdlZWtkYXkgbmdiLWRwLXNob3d3ZWVrXCI+PC9kaXY+XG4gICAgICA8ZGl2ICpuZ0Zvcj1cImxldCB3IG9mIG1vbnRoLndlZWtkYXlzXCIgY2xhc3M9XCJuZ2ItZHAtd2Vla2RheSBzbWFsbFwiPlxuICAgICAgICB7eyBpMThuLmdldFdlZWtkYXlTaG9ydE5hbWUodykgfX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtd2VlayBbbmdGb3JPZl09XCJtb250aC53ZWVrc1wiPlxuICAgICAgPGRpdiAqbmdJZj1cIiF3ZWVrLmNvbGxhcHNlZFwiIGNsYXNzPVwibmdiLWRwLXdlZWtcIiByb2xlPVwicm93XCI+XG4gICAgICAgIDxkaXYgKm5nSWY9XCJzaG93V2Vla051bWJlcnNcIiBjbGFzcz1cIm5nYi1kcC13ZWVrLW51bWJlciBzbWFsbCB0ZXh0LW11dGVkXCI+e3sgaTE4bi5nZXRXZWVrTnVtZXJhbHMod2Vlay5udW1iZXIpIH19PC9kaXY+XG4gICAgICAgIDxkaXYgKm5nRm9yPVwibGV0IGRheSBvZiB3ZWVrLmRheXNcIiAoY2xpY2spPVwiZG9TZWxlY3QoZGF5KVwiIGNsYXNzPVwibmdiLWRwLWRheVwiIHJvbGU9XCJncmlkY2VsbFwiXG4gICAgICAgICAgW2NsYXNzLmRpc2FibGVkXT1cImRheS5jb250ZXh0LmRpc2FibGVkXCJcbiAgICAgICAgICBbdGFiaW5kZXhdPVwiZGF5LnRhYmluZGV4XCJcbiAgICAgICAgICBbY2xhc3MuaGlkZGVuXT1cImRheS5oaWRkZW5cIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiZGF5LmFyaWFMYWJlbFwiPlxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdJZl09XCIhZGF5LmhpZGRlblwiPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRheVRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImRheS5jb250ZXh0XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlck1vbnRoVmlldyB7XG4gIEBJbnB1dCgpIGRheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxEYXlUZW1wbGF0ZUNvbnRleHQ+O1xuICBASW5wdXQoKSBtb250aDogTW9udGhWaWV3TW9kZWw7XG4gIEBJbnB1dCgpIHNob3dXZWVrZGF5cztcbiAgQElucHV0KCkgc2hvd1dlZWtOdW1iZXJzO1xuXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYkRhdGU+KCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGkxOG46IE5nYkRhdGVwaWNrZXJJMThuKSB7fVxuXG4gIGRvU2VsZWN0KGRheTogRGF5Vmlld01vZGVsKSB7XG4gICAgaWYgKCFkYXkuY29udGV4dC5kaXNhYmxlZCAmJiAhZGF5LmhpZGRlbikge1xuICAgICAgdGhpcy5zZWxlY3QuZW1pdChkYXkuZGF0ZSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOYXZpZ2F0aW9uRXZlbnQsIE1vbnRoVmlld01vZGVsfSBmcm9tICcuL2RhdGVwaWNrZXItdmlldy1tb2RlbCc7XG5pbXBvcnQge05nYkRhdGV9IGZyb20gJy4vbmdiLWRhdGUnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VySTE4bn0gZnJvbSAnLi9kYXRlcGlja2VyLWkxOG4nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItZGF0ZXBpY2tlci1uYXZpZ2F0aW9uJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHN0eWxlVXJsczogWycuL2RhdGVwaWNrZXItbmF2aWdhdGlvbi5zY3NzJ10sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cIm5nYi1kcC1hcnJvd1wiPlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWxpbmsgbmdiLWRwLWFycm93LWJ0blwiIChjbGljayk9XCJuYXZpZ2F0ZS5lbWl0KG5hdmlnYXRpb24uUFJFVilcIiBbZGlzYWJsZWRdPVwicHJldkRpc2FibGVkXCJcbiAgICAgICAgICAgICAgaTE4bi1hcmlhLWxhYmVsPVwiQEBuZ2IuZGF0ZXBpY2tlci5wcmV2aW91cy1tb250aFwiIGFyaWEtbGFiZWw9XCJQcmV2aW91cyBtb250aFwiXG4gICAgICAgICAgICAgIGkxOG4tdGl0bGU9XCJAQG5nYi5kYXRlcGlja2VyLnByZXZpb3VzLW1vbnRoXCIgdGl0bGU9XCJQcmV2aW91cyBtb250aFwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cIm5nYi1kcC1uYXZpZ2F0aW9uLWNoZXZyb25cIj48L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgICA8bmdiLWRhdGVwaWNrZXItbmF2aWdhdGlvbi1zZWxlY3QgKm5nSWY9XCJzaG93U2VsZWN0XCIgY2xhc3M9XCJuZ2ItZHAtbmF2aWdhdGlvbi1zZWxlY3RcIlxuICAgICAgW2RhdGVdPVwiZGF0ZVwiXG4gICAgICBbZGlzYWJsZWRdID0gXCJkaXNhYmxlZFwiXG4gICAgICBbbW9udGhzXT1cInNlbGVjdEJveGVzLm1vbnRoc1wiXG4gICAgICBbeWVhcnNdPVwic2VsZWN0Qm94ZXMueWVhcnNcIlxuICAgICAgKHNlbGVjdCk9XCJzZWxlY3QuZW1pdCgkZXZlbnQpXCI+XG4gICAgPC9uZ2ItZGF0ZXBpY2tlci1uYXZpZ2F0aW9uLXNlbGVjdD5cblxuICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cIiFzaG93U2VsZWN0XCIgbmdGb3IgbGV0LW1vbnRoIFtuZ0Zvck9mXT1cIm1vbnRoc1wiIGxldC1pPVwiaW5kZXhcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJuZ2ItZHAtYXJyb3dcIiAqbmdJZj1cImkgPiAwXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwibmdiLWRwLW1vbnRoLW5hbWVcIj5cbiAgICAgICAge3sgaTE4bi5nZXRNb250aEZ1bGxOYW1lKG1vbnRoLm51bWJlciwgbW9udGgueWVhcikgfX0ge3sgaTE4bi5nZXRZZWFyTnVtZXJhbHMobW9udGgueWVhcikgfX1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cIm5nYi1kcC1hcnJvd1wiICpuZ0lmPVwiaSAhPT0gbW9udGhzLmxlbmd0aCAtIDFcIj48L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxkaXYgY2xhc3M9XCJuZ2ItZHAtYXJyb3cgcmlnaHRcIj5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1saW5rIG5nYi1kcC1hcnJvdy1idG5cIiAoY2xpY2spPVwibmF2aWdhdGUuZW1pdChuYXZpZ2F0aW9uLk5FWFQpXCIgW2Rpc2FibGVkXT1cIm5leHREaXNhYmxlZFwiXG4gICAgICAgICAgICAgIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLmRhdGVwaWNrZXIubmV4dC1tb250aFwiIGFyaWEtbGFiZWw9XCJOZXh0IG1vbnRoXCJcbiAgICAgICAgICAgICAgaTE4bi10aXRsZT1cIkBAbmdiLmRhdGVwaWNrZXIubmV4dC1tb250aFwiIHRpdGxlPVwiTmV4dCBtb250aFwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cIm5nYi1kcC1uYXZpZ2F0aW9uLWNoZXZyb25cIj48L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVwaWNrZXJOYXZpZ2F0aW9uIHtcbiAgbmF2aWdhdGlvbiA9IE5hdmlnYXRpb25FdmVudDtcblxuICBASW5wdXQoKSBkYXRlOiBOZ2JEYXRlO1xuICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcbiAgQElucHV0KCkgbW9udGhzOiBNb250aFZpZXdNb2RlbFtdID0gW107XG4gIEBJbnB1dCgpIHNob3dTZWxlY3Q6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHByZXZEaXNhYmxlZDogYm9vbGVhbjtcbiAgQElucHV0KCkgbmV4dERpc2FibGVkOiBib29sZWFuO1xuICBASW5wdXQoKSBzZWxlY3RCb3hlczoge3llYXJzOiBudW1iZXJbXSwgbW9udGhzOiBudW1iZXJbXX07XG5cbiAgQE91dHB1dCgpIG5hdmlnYXRlID0gbmV3IEV2ZW50RW1pdHRlcjxOYXZpZ2F0aW9uRXZlbnQ+KCk7XG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYkRhdGU+KCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGkxOG46IE5nYkRhdGVwaWNrZXJJMThuKSB7fVxufVxuIiwiaW1wb3J0IHtmcm9tRXZlbnQsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIG1hcCwgdGFrZVVudGlsLCB3aXRoTGF0ZXN0RnJvbX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuXG5cbmNvbnN0IEZPQ1VTQUJMRV9FTEVNRU5UU19TRUxFQ1RPUiA9IFtcbiAgJ2FbaHJlZl0nLCAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKScsICdpbnB1dDpub3QoW2Rpc2FibGVkXSk6bm90KFt0eXBlPVwiaGlkZGVuXCJdKScsICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pJyxcbiAgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKScsICdbY29udGVudGVkaXRhYmxlXScsICdbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSknXG5dLmpvaW4oJywgJyk7XG5cbi8qKlxuICogUmV0dXJucyBmaXJzdCBhbmQgbGFzdCBmb2N1c2FibGUgZWxlbWVudHMgaW5zaWRlIG9mIGEgZ2l2ZW4gZWxlbWVudCBiYXNlZCBvbiBzcGVjaWZpYyBDU1Mgc2VsZWN0b3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZvY3VzYWJsZUJvdW5kYXJ5RWxlbWVudHMoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudFtdIHtcbiAgY29uc3QgbGlzdDogSFRNTEVsZW1lbnRbXSA9XG4gICAgICBBcnJheS5mcm9tKGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChGT0NVU0FCTEVfRUxFTUVOVFNfU0VMRUNUT1IpIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+KVxuICAgICAgICAgIC5maWx0ZXIoZWwgPT4gZWwudGFiSW5kZXggIT09IC0xKTtcbiAgcmV0dXJuIFtsaXN0WzBdLCBsaXN0W2xpc3QubGVuZ3RoIC0gMV1dO1xufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHRoYXQgZW5mb3JjZXMgYnJvd3NlciBmb2N1cyB0byBiZSB0cmFwcGVkIGluc2lkZSBhIERPTSBlbGVtZW50LlxuICpcbiAqIFdvcmtzIG9ubHkgZm9yIGNsaWNrcyBpbnNpZGUgdGhlIGVsZW1lbnQgYW5kIG5hdmlnYXRpb24gd2l0aCAnVGFiJywgaWdub3JpbmcgY2xpY2tzIG91dHNpZGUgb2YgdGhlIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCBhcm91bmQgd2hpY2ggZm9jdXMgd2lsbCBiZSB0cmFwcGVkIGluc2lkZVxuICogQHBhcmFtIHN0b3BGb2N1c1RyYXAkIFRoZSBvYnNlcnZhYmxlIHN0cmVhbS4gV2hlbiBjb21wbGV0ZWQgdGhlIGZvY3VzIHRyYXAgd2lsbCBjbGVhbiB1cCBsaXN0ZW5lcnNcbiAqIGFuZCBmcmVlIGludGVybmFsIHJlc291cmNlc1xuICogQHBhcmFtIHJlZm9jdXNPbkNsaWNrIFB1dCB0aGUgZm9jdXMgYmFjayB0byB0aGUgbGFzdCBmb2N1c2VkIGVsZW1lbnQgd2hlbmV2ZXIgYSBjbGljayBvY2N1cnMgb24gZWxlbWVudCAoZGVmYXVsdCB0b1xuICogZmFsc2UpXG4gKi9cbmV4cG9ydCBjb25zdCBuZ2JGb2N1c1RyYXAgPSAoZWxlbWVudDogSFRNTEVsZW1lbnQsIHN0b3BGb2N1c1RyYXAkOiBPYnNlcnZhYmxlPGFueT4sIHJlZm9jdXNPbkNsaWNrID0gZmFsc2UpID0+IHtcbiAgLy8gbGFzdCBmb2N1c2VkIGVsZW1lbnRcbiAgY29uc3QgbGFzdEZvY3VzZWRFbGVtZW50JCA9XG4gICAgICBmcm9tRXZlbnQ8Rm9jdXNFdmVudD4oZWxlbWVudCwgJ2ZvY3VzaW4nKS5waXBlKHRha2VVbnRpbChzdG9wRm9jdXNUcmFwJCksIG1hcChlID0+IGUudGFyZ2V0KSk7XG5cbiAgLy8gJ3RhYicgLyAnc2hpZnQrdGFiJyBzdHJlYW1cbiAgZnJvbUV2ZW50PEtleWJvYXJkRXZlbnQ+KGVsZW1lbnQsICdrZXlkb3duJylcbiAgICAgIC5waXBlKFxuICAgICAgICAgIHRha2VVbnRpbChzdG9wRm9jdXNUcmFwJCksXG4gICAgICAgICAgLy8gdHNsaW50OmRpc2FibGU6ZGVwcmVjYXRpb25cbiAgICAgICAgICBmaWx0ZXIoZSA9PiBlLndoaWNoID09PSBLZXkuVGFiKSxcbiAgICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOmRlcHJlY2F0aW9uXG4gICAgICAgICAgd2l0aExhdGVzdEZyb20obGFzdEZvY3VzZWRFbGVtZW50JCkpXG4gICAgICAuc3Vic2NyaWJlKChbdGFiRXZlbnQsIGZvY3VzZWRFbGVtZW50XSkgPT4ge1xuICAgICAgICBjb25zdFtmaXJzdCwgbGFzdF0gPSBnZXRGb2N1c2FibGVCb3VuZGFyeUVsZW1lbnRzKGVsZW1lbnQpO1xuXG4gICAgICAgIGlmICgoZm9jdXNlZEVsZW1lbnQgPT09IGZpcnN0IHx8IGZvY3VzZWRFbGVtZW50ID09PSBlbGVtZW50KSAmJiB0YWJFdmVudC5zaGlmdEtleSkge1xuICAgICAgICAgIGxhc3QuZm9jdXMoKTtcbiAgICAgICAgICB0YWJFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvY3VzZWRFbGVtZW50ID09PSBsYXN0ICYmICF0YWJFdmVudC5zaGlmdEtleSkge1xuICAgICAgICAgIGZpcnN0LmZvY3VzKCk7XG4gICAgICAgICAgdGFiRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgLy8gaW5zaWRlIGNsaWNrXG4gIGlmIChyZWZvY3VzT25DbGljaykge1xuICAgIGZyb21FdmVudChlbGVtZW50LCAnY2xpY2snKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwoc3RvcEZvY3VzVHJhcCQpLCB3aXRoTGF0ZXN0RnJvbShsYXN0Rm9jdXNlZEVsZW1lbnQkKSwgbWFwKGFyciA9PiBhcnJbMV0gYXMgSFRNTEVsZW1lbnQpKVxuICAgICAgICAuc3Vic2NyaWJlKGxhc3RGb2N1c2VkRWxlbWVudCA9PiBsYXN0Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKSk7XG4gIH1cbn07XG4iLCIvLyBwcmV2aW91cyB2ZXJzaW9uOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvYm9vdHN0cmFwL2Jsb2IvMDdjMzFkMDczMWY3Y2IwNjhhMTkzMmI4ZTAxZDIzMTJiNzk2YjRlYy9zcmMvcG9zaXRpb24vcG9zaXRpb24uanNcbmV4cG9ydCBjbGFzcyBQb3NpdGlvbmluZyB7XG4gIHByaXZhdGUgZ2V0QWxsU3R5bGVzKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7IHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTsgfVxuXG4gIHByaXZhdGUgZ2V0U3R5bGUoZWxlbWVudDogSFRNTEVsZW1lbnQsIHByb3A6IHN0cmluZyk6IHN0cmluZyB7IHJldHVybiB0aGlzLmdldEFsbFN0eWxlcyhlbGVtZW50KVtwcm9wXTsgfVxuXG4gIHByaXZhdGUgaXNTdGF0aWNQb3NpdGlvbmVkKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLmdldFN0eWxlKGVsZW1lbnQsICdwb3NpdGlvbicpIHx8ICdzdGF0aWMnKSA9PT0gJ3N0YXRpYyc7XG4gIH1cblxuICBwcml2YXRlIG9mZnNldFBhcmVudChlbGVtZW50OiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50IHtcbiAgICBsZXQgb2Zmc2V0UGFyZW50RWwgPSA8SFRNTEVsZW1lbnQ+ZWxlbWVudC5vZmZzZXRQYXJlbnQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgd2hpbGUgKG9mZnNldFBhcmVudEVsICYmIG9mZnNldFBhcmVudEVsICE9PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgdGhpcy5pc1N0YXRpY1Bvc2l0aW9uZWQob2Zmc2V0UGFyZW50RWwpKSB7XG4gICAgICBvZmZzZXRQYXJlbnRFbCA9IDxIVE1MRWxlbWVudD5vZmZzZXRQYXJlbnRFbC5vZmZzZXRQYXJlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9mZnNldFBhcmVudEVsIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgfVxuXG4gIHBvc2l0aW9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCByb3VuZCA9IHRydWUpOiBDbGllbnRSZWN0IHtcbiAgICBsZXQgZWxQb3NpdGlvbjogQ2xpZW50UmVjdDtcbiAgICBsZXQgcGFyZW50T2Zmc2V0OiBDbGllbnRSZWN0ID0ge3dpZHRoOiAwLCBoZWlnaHQ6IDAsIHRvcDogMCwgYm90dG9tOiAwLCBsZWZ0OiAwLCByaWdodDogMH07XG5cbiAgICBpZiAodGhpcy5nZXRTdHlsZShlbGVtZW50LCAncG9zaXRpb24nKSA9PT0gJ2ZpeGVkJykge1xuICAgICAgZWxQb3NpdGlvbiA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG9mZnNldFBhcmVudEVsID0gdGhpcy5vZmZzZXRQYXJlbnQoZWxlbWVudCk7XG5cbiAgICAgIGVsUG9zaXRpb24gPSB0aGlzLm9mZnNldChlbGVtZW50LCBmYWxzZSk7XG5cbiAgICAgIGlmIChvZmZzZXRQYXJlbnRFbCAhPT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICAgIHBhcmVudE9mZnNldCA9IHRoaXMub2Zmc2V0KG9mZnNldFBhcmVudEVsLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudE9mZnNldC50b3AgKz0gb2Zmc2V0UGFyZW50RWwuY2xpZW50VG9wO1xuICAgICAgcGFyZW50T2Zmc2V0LmxlZnQgKz0gb2Zmc2V0UGFyZW50RWwuY2xpZW50TGVmdDtcbiAgICB9XG5cbiAgICBlbFBvc2l0aW9uLnRvcCAtPSBwYXJlbnRPZmZzZXQudG9wO1xuICAgIGVsUG9zaXRpb24uYm90dG9tIC09IHBhcmVudE9mZnNldC50b3A7XG4gICAgZWxQb3NpdGlvbi5sZWZ0IC09IHBhcmVudE9mZnNldC5sZWZ0O1xuICAgIGVsUG9zaXRpb24ucmlnaHQgLT0gcGFyZW50T2Zmc2V0LmxlZnQ7XG5cbiAgICBpZiAocm91bmQpIHtcbiAgICAgIGVsUG9zaXRpb24udG9wID0gTWF0aC5yb3VuZChlbFBvc2l0aW9uLnRvcCk7XG4gICAgICBlbFBvc2l0aW9uLmJvdHRvbSA9IE1hdGgucm91bmQoZWxQb3NpdGlvbi5ib3R0b20pO1xuICAgICAgZWxQb3NpdGlvbi5sZWZ0ID0gTWF0aC5yb3VuZChlbFBvc2l0aW9uLmxlZnQpO1xuICAgICAgZWxQb3NpdGlvbi5yaWdodCA9IE1hdGgucm91bmQoZWxQb3NpdGlvbi5yaWdodCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsUG9zaXRpb247XG4gIH1cblxuICBvZmZzZXQoZWxlbWVudDogSFRNTEVsZW1lbnQsIHJvdW5kID0gdHJ1ZSk6IENsaWVudFJlY3Qge1xuICAgIGNvbnN0IGVsQmNyID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB2aWV3cG9ydE9mZnNldCA9IHtcbiAgICAgIHRvcDogd2luZG93LnBhZ2VZT2Zmc2V0IC0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFRvcCxcbiAgICAgIGxlZnQ6IHdpbmRvdy5wYWdlWE9mZnNldCAtIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRMZWZ0XG4gICAgfTtcblxuICAgIGxldCBlbE9mZnNldCA9IHtcbiAgICAgIGhlaWdodDogZWxCY3IuaGVpZ2h0IHx8IGVsZW1lbnQub2Zmc2V0SGVpZ2h0LFxuICAgICAgd2lkdGg6IGVsQmNyLndpZHRoIHx8IGVsZW1lbnQub2Zmc2V0V2lkdGgsXG4gICAgICB0b3A6IGVsQmNyLnRvcCArIHZpZXdwb3J0T2Zmc2V0LnRvcCxcbiAgICAgIGJvdHRvbTogZWxCY3IuYm90dG9tICsgdmlld3BvcnRPZmZzZXQudG9wLFxuICAgICAgbGVmdDogZWxCY3IubGVmdCArIHZpZXdwb3J0T2Zmc2V0LmxlZnQsXG4gICAgICByaWdodDogZWxCY3IucmlnaHQgKyB2aWV3cG9ydE9mZnNldC5sZWZ0XG4gICAgfTtcblxuICAgIGlmIChyb3VuZCkge1xuICAgICAgZWxPZmZzZXQuaGVpZ2h0ID0gTWF0aC5yb3VuZChlbE9mZnNldC5oZWlnaHQpO1xuICAgICAgZWxPZmZzZXQud2lkdGggPSBNYXRoLnJvdW5kKGVsT2Zmc2V0LndpZHRoKTtcbiAgICAgIGVsT2Zmc2V0LnRvcCA9IE1hdGgucm91bmQoZWxPZmZzZXQudG9wKTtcbiAgICAgIGVsT2Zmc2V0LmJvdHRvbSA9IE1hdGgucm91bmQoZWxPZmZzZXQuYm90dG9tKTtcbiAgICAgIGVsT2Zmc2V0LmxlZnQgPSBNYXRoLnJvdW5kKGVsT2Zmc2V0LmxlZnQpO1xuICAgICAgZWxPZmZzZXQucmlnaHQgPSBNYXRoLnJvdW5kKGVsT2Zmc2V0LnJpZ2h0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxPZmZzZXQ7XG4gIH1cblxuICBwb3NpdGlvbkVsZW1lbnRzKGhvc3RFbGVtZW50OiBIVE1MRWxlbWVudCwgdGFyZ2V0RWxlbWVudDogSFRNTEVsZW1lbnQsIHBsYWNlbWVudDogc3RyaW5nLCBhcHBlbmRUb0JvZHk/OiBib29sZWFuKTpcbiAgICAgIENsaWVudFJlY3Qge1xuICAgIGNvbnN0IGhvc3RFbFBvc2l0aW9uID0gYXBwZW5kVG9Cb2R5ID8gdGhpcy5vZmZzZXQoaG9zdEVsZW1lbnQsIGZhbHNlKSA6IHRoaXMucG9zaXRpb24oaG9zdEVsZW1lbnQsIGZhbHNlKTtcbiAgICBjb25zdCB0YXJnZXRFbFN0eWxlcyA9IHRoaXMuZ2V0QWxsU3R5bGVzKHRhcmdldEVsZW1lbnQpO1xuICAgIGNvbnN0IHRhcmdldEVsQkNSID0gdGFyZ2V0RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBwbGFjZW1lbnRQcmltYXJ5ID0gcGxhY2VtZW50LnNwbGl0KCctJylbMF0gfHwgJ3RvcCc7XG4gICAgY29uc3QgcGxhY2VtZW50U2Vjb25kYXJ5ID0gcGxhY2VtZW50LnNwbGl0KCctJylbMV0gfHwgJ2NlbnRlcic7XG5cbiAgICBsZXQgdGFyZ2V0RWxQb3NpdGlvbjogQ2xpZW50UmVjdCA9IHtcbiAgICAgICdoZWlnaHQnOiB0YXJnZXRFbEJDUi5oZWlnaHQgfHwgdGFyZ2V0RWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICAnd2lkdGgnOiB0YXJnZXRFbEJDUi53aWR0aCB8fCB0YXJnZXRFbGVtZW50Lm9mZnNldFdpZHRoLFxuICAgICAgJ3RvcCc6IDAsXG4gICAgICAnYm90dG9tJzogdGFyZ2V0RWxCQ1IuaGVpZ2h0IHx8IHRhcmdldEVsZW1lbnQub2Zmc2V0SGVpZ2h0LFxuICAgICAgJ2xlZnQnOiAwLFxuICAgICAgJ3JpZ2h0JzogdGFyZ2V0RWxCQ1Iud2lkdGggfHwgdGFyZ2V0RWxlbWVudC5vZmZzZXRXaWR0aFxuICAgIH07XG5cbiAgICBzd2l0Y2ggKHBsYWNlbWVudFByaW1hcnkpIHtcbiAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgIHRhcmdldEVsUG9zaXRpb24udG9wID1cbiAgICAgICAgICAgIGhvc3RFbFBvc2l0aW9uLnRvcCAtICh0YXJnZXRFbGVtZW50Lm9mZnNldEhlaWdodCArIHBhcnNlRmxvYXQodGFyZ2V0RWxTdHlsZXMubWFyZ2luQm90dG9tKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgdGFyZ2V0RWxQb3NpdGlvbi50b3AgPSBob3N0RWxQb3NpdGlvbi50b3AgKyBob3N0RWxQb3NpdGlvbi5oZWlnaHQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgIHRhcmdldEVsUG9zaXRpb24ubGVmdCA9XG4gICAgICAgICAgICBob3N0RWxQb3NpdGlvbi5sZWZ0IC0gKHRhcmdldEVsZW1lbnQub2Zmc2V0V2lkdGggKyBwYXJzZUZsb2F0KHRhcmdldEVsU3R5bGVzLm1hcmdpblJpZ2h0KSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICB0YXJnZXRFbFBvc2l0aW9uLmxlZnQgPSBob3N0RWxQb3NpdGlvbi5sZWZ0ICsgaG9zdEVsUG9zaXRpb24ud2lkdGg7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHN3aXRjaCAocGxhY2VtZW50U2Vjb25kYXJ5KSB7XG4gICAgICBjYXNlICd0b3AnOlxuICAgICAgICB0YXJnZXRFbFBvc2l0aW9uLnRvcCA9IGhvc3RFbFBvc2l0aW9uLnRvcDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICB0YXJnZXRFbFBvc2l0aW9uLnRvcCA9IGhvc3RFbFBvc2l0aW9uLnRvcCArIGhvc3RFbFBvc2l0aW9uLmhlaWdodCAtIHRhcmdldEVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICB0YXJnZXRFbFBvc2l0aW9uLmxlZnQgPSBob3N0RWxQb3NpdGlvbi5sZWZ0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgdGFyZ2V0RWxQb3NpdGlvbi5sZWZ0ID0gaG9zdEVsUG9zaXRpb24ubGVmdCArIGhvc3RFbFBvc2l0aW9uLndpZHRoIC0gdGFyZ2V0RWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjZW50ZXInOlxuICAgICAgICBpZiAocGxhY2VtZW50UHJpbWFyeSA9PT0gJ3RvcCcgfHwgcGxhY2VtZW50UHJpbWFyeSA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgICB0YXJnZXRFbFBvc2l0aW9uLmxlZnQgPSBob3N0RWxQb3NpdGlvbi5sZWZ0ICsgaG9zdEVsUG9zaXRpb24ud2lkdGggLyAyIC0gdGFyZ2V0RWxlbWVudC5vZmZzZXRXaWR0aCAvIDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0RWxQb3NpdGlvbi50b3AgPSBob3N0RWxQb3NpdGlvbi50b3AgKyBob3N0RWxQb3NpdGlvbi5oZWlnaHQgLyAyIC0gdGFyZ2V0RWxlbWVudC5vZmZzZXRIZWlnaHQgLyAyO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRhcmdldEVsUG9zaXRpb24udG9wID0gTWF0aC5yb3VuZCh0YXJnZXRFbFBvc2l0aW9uLnRvcCk7XG4gICAgdGFyZ2V0RWxQb3NpdGlvbi5ib3R0b20gPSBNYXRoLnJvdW5kKHRhcmdldEVsUG9zaXRpb24uYm90dG9tKTtcbiAgICB0YXJnZXRFbFBvc2l0aW9uLmxlZnQgPSBNYXRoLnJvdW5kKHRhcmdldEVsUG9zaXRpb24ubGVmdCk7XG4gICAgdGFyZ2V0RWxQb3NpdGlvbi5yaWdodCA9IE1hdGgucm91bmQodGFyZ2V0RWxQb3NpdGlvbi5yaWdodCk7XG5cbiAgICByZXR1cm4gdGFyZ2V0RWxQb3NpdGlvbjtcbiAgfVxuXG4gIC8vIGdldCB0aGUgYXZhaWxhYmxlIHBsYWNlbWVudHMgb2YgdGhlIHRhcmdldCBlbGVtZW50IGluIHRoZSB2aWV3cG9ydCBkZXBlbmRpbmcgb24gdGhlIGhvc3QgZWxlbWVudFxuICBnZXRBdmFpbGFibGVQbGFjZW1lbnRzKGhvc3RFbGVtZW50OiBIVE1MRWxlbWVudCwgdGFyZ2V0RWxlbWVudDogSFRNTEVsZW1lbnQpOiBzdHJpbmdbXSB7XG4gICAgbGV0IGF2YWlsYWJsZVBsYWNlbWVudHM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICBsZXQgaG9zdEVsZW1DbGllbnRSZWN0ID0gaG9zdEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IHRhcmdldEVsZW1DbGllbnRSZWN0ID0gdGFyZ2V0RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgaHRtbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICBsZXQgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IHx8IGh0bWwuY2xpZW50SGVpZ2h0O1xuICAgIGxldCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIHx8IGh0bWwuY2xpZW50V2lkdGg7XG4gICAgbGV0IGhvc3RFbGVtQ2xpZW50UmVjdEhvckNlbnRlciA9IGhvc3RFbGVtQ2xpZW50UmVjdC5sZWZ0ICsgaG9zdEVsZW1DbGllbnRSZWN0LndpZHRoIC8gMjtcbiAgICBsZXQgaG9zdEVsZW1DbGllbnRSZWN0VmVyQ2VudGVyID0gaG9zdEVsZW1DbGllbnRSZWN0LnRvcCArIGhvc3RFbGVtQ2xpZW50UmVjdC5oZWlnaHQgLyAyO1xuXG4gICAgLy8gbGVmdDogY2hlY2sgaWYgdGFyZ2V0IHdpZHRoIGNhbiBiZSBwbGFjZWQgYmV0d2VlbiBob3N0IGxlZnQgYW5kIHZpZXdwb3J0IHN0YXJ0IGFuZCBhbHNvIGhlaWdodCBvZiB0YXJnZXQgaXNcbiAgICAvLyBpbnNpZGUgdmlld3BvcnRcbiAgICBpZiAodGFyZ2V0RWxlbUNsaWVudFJlY3Qud2lkdGggPCBob3N0RWxlbUNsaWVudFJlY3QubGVmdCkge1xuICAgICAgLy8gY2hlY2sgZm9yIGxlZnQgb25seVxuICAgICAgaWYgKGhvc3RFbGVtQ2xpZW50UmVjdFZlckNlbnRlciA+IHRhcmdldEVsZW1DbGllbnRSZWN0LmhlaWdodCAvIDIgJiZcbiAgICAgICAgICB3aW5kb3dIZWlnaHQgLSBob3N0RWxlbUNsaWVudFJlY3RWZXJDZW50ZXIgPiB0YXJnZXRFbGVtQ2xpZW50UmVjdC5oZWlnaHQgLyAyKSB7XG4gICAgICAgIGF2YWlsYWJsZVBsYWNlbWVudHMuc3BsaWNlKGF2YWlsYWJsZVBsYWNlbWVudHMubGVuZ3RoLCAxLCAnbGVmdCcpO1xuICAgICAgfVxuICAgICAgLy8gY2hlY2sgZm9yIGxlZnQtdG9wIGFuZCBsZWZ0LWJvdHRvbVxuICAgICAgdGhpcy5zZXRTZWNvbmRhcnlQbGFjZW1lbnRGb3JMZWZ0UmlnaHQoaG9zdEVsZW1DbGllbnRSZWN0LCB0YXJnZXRFbGVtQ2xpZW50UmVjdCwgJ2xlZnQnLCBhdmFpbGFibGVQbGFjZW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyB0b3A6IHRhcmdldCBoZWlnaHQgaXMgbGVzcyB0aGFuIGhvc3QgdG9wXG4gICAgaWYgKHRhcmdldEVsZW1DbGllbnRSZWN0LmhlaWdodCA8IGhvc3RFbGVtQ2xpZW50UmVjdC50b3ApIHtcbiAgICAgIGlmIChob3N0RWxlbUNsaWVudFJlY3RIb3JDZW50ZXIgPiB0YXJnZXRFbGVtQ2xpZW50UmVjdC53aWR0aCAvIDIgJiZcbiAgICAgICAgICB3aW5kb3dXaWR0aCAtIGhvc3RFbGVtQ2xpZW50UmVjdEhvckNlbnRlciA+IHRhcmdldEVsZW1DbGllbnRSZWN0LndpZHRoIC8gMikge1xuICAgICAgICBhdmFpbGFibGVQbGFjZW1lbnRzLnNwbGljZShhdmFpbGFibGVQbGFjZW1lbnRzLmxlbmd0aCwgMSwgJ3RvcCcpO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRTZWNvbmRhcnlQbGFjZW1lbnRGb3JUb3BCb3R0b20oaG9zdEVsZW1DbGllbnRSZWN0LCB0YXJnZXRFbGVtQ2xpZW50UmVjdCwgJ3RvcCcsIGF2YWlsYWJsZVBsYWNlbWVudHMpO1xuICAgIH1cblxuICAgIC8vIHJpZ2h0OiBjaGVjayBpZiB0YXJnZXQgd2lkdGggY2FuIGJlIHBsYWNlZCBiZXR3ZWVuIGhvc3QgcmlnaHQgYW5kIHZpZXdwb3J0IGVuZCBhbmQgYWxzbyBoZWlnaHQgb2YgdGFyZ2V0IGlzXG4gICAgLy8gaW5zaWRlIHZpZXdwb3J0XG4gICAgaWYgKHdpbmRvd1dpZHRoIC0gaG9zdEVsZW1DbGllbnRSZWN0LnJpZ2h0ID4gdGFyZ2V0RWxlbUNsaWVudFJlY3Qud2lkdGgpIHtcbiAgICAgIC8vIGNoZWNrIGZvciByaWdodCBvbmx5XG4gICAgICBpZiAoaG9zdEVsZW1DbGllbnRSZWN0VmVyQ2VudGVyID4gdGFyZ2V0RWxlbUNsaWVudFJlY3QuaGVpZ2h0IC8gMiAmJlxuICAgICAgICAgIHdpbmRvd0hlaWdodCAtIGhvc3RFbGVtQ2xpZW50UmVjdFZlckNlbnRlciA+IHRhcmdldEVsZW1DbGllbnRSZWN0LmhlaWdodCAvIDIpIHtcbiAgICAgICAgYXZhaWxhYmxlUGxhY2VtZW50cy5zcGxpY2UoYXZhaWxhYmxlUGxhY2VtZW50cy5sZW5ndGgsIDEsICdyaWdodCcpO1xuICAgICAgfVxuICAgICAgLy8gY2hlY2sgZm9yIHJpZ2h0LXRvcCBhbmQgcmlnaHQtYm90dG9tXG4gICAgICB0aGlzLnNldFNlY29uZGFyeVBsYWNlbWVudEZvckxlZnRSaWdodChob3N0RWxlbUNsaWVudFJlY3QsIHRhcmdldEVsZW1DbGllbnRSZWN0LCAncmlnaHQnLCBhdmFpbGFibGVQbGFjZW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBib3R0b206IGNoZWNrIGlmIHRoZXJlIGlzIGVub3VnaCBzcGFjZSBiZXR3ZWVuIGhvc3QgYm90dG9tIGFuZCB2aWV3cG9ydCBlbmQgZm9yIHRhcmdldCBoZWlnaHRcbiAgICBpZiAod2luZG93SGVpZ2h0IC0gaG9zdEVsZW1DbGllbnRSZWN0LmJvdHRvbSA+IHRhcmdldEVsZW1DbGllbnRSZWN0LmhlaWdodCkge1xuICAgICAgaWYgKGhvc3RFbGVtQ2xpZW50UmVjdEhvckNlbnRlciA+IHRhcmdldEVsZW1DbGllbnRSZWN0LndpZHRoIC8gMiAmJlxuICAgICAgICAgIHdpbmRvd1dpZHRoIC0gaG9zdEVsZW1DbGllbnRSZWN0SG9yQ2VudGVyID4gdGFyZ2V0RWxlbUNsaWVudFJlY3Qud2lkdGggLyAyKSB7XG4gICAgICAgIGF2YWlsYWJsZVBsYWNlbWVudHMuc3BsaWNlKGF2YWlsYWJsZVBsYWNlbWVudHMubGVuZ3RoLCAxLCAnYm90dG9tJyk7XG4gICAgICB9XG4gICAgICB0aGlzLnNldFNlY29uZGFyeVBsYWNlbWVudEZvclRvcEJvdHRvbShob3N0RWxlbUNsaWVudFJlY3QsIHRhcmdldEVsZW1DbGllbnRSZWN0LCAnYm90dG9tJywgYXZhaWxhYmxlUGxhY2VtZW50cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF2YWlsYWJsZVBsYWNlbWVudHM7XG4gIH1cblxuICAvKipcbiAgICogY2hlY2sgaWYgc2Vjb25kYXJ5IHBsYWNlbWVudCBmb3IgbGVmdCBhbmQgcmlnaHQgYXJlIGF2YWlsYWJsZSBpLmUuIGxlZnQtdG9wLCBsZWZ0LWJvdHRvbSwgcmlnaHQtdG9wLCByaWdodC1ib3R0b21cbiAgICogcHJpbWFyeXBsYWNlbWVudDogbGVmdHxyaWdodFxuICAgKiBhdmFpbGFibGVQbGFjZW1lbnRBcnI6IGFycmF5IGluIHdoaWNoIGF2YWlsYWJsZSBwbGFjZW1lbnRzIHRvIGJlIHNldFxuICAgKi9cbiAgcHJpdmF0ZSBzZXRTZWNvbmRhcnlQbGFjZW1lbnRGb3JMZWZ0UmlnaHQoXG4gICAgICBob3N0RWxlbUNsaWVudFJlY3Q6IENsaWVudFJlY3QsIHRhcmdldEVsZW1DbGllbnRSZWN0OiBDbGllbnRSZWN0LCBwcmltYXJ5UGxhY2VtZW50OiBzdHJpbmcsXG4gICAgICBhdmFpbGFibGVQbGFjZW1lbnRBcnI6IEFycmF5PHN0cmluZz4pIHtcbiAgICBsZXQgaHRtbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAvLyBjaGVjayBmb3IgbGVmdC1ib3R0b21cbiAgICBpZiAodGFyZ2V0RWxlbUNsaWVudFJlY3QuaGVpZ2h0IDw9IGhvc3RFbGVtQ2xpZW50UmVjdC5ib3R0b20pIHtcbiAgICAgIGF2YWlsYWJsZVBsYWNlbWVudEFyci5zcGxpY2UoYXZhaWxhYmxlUGxhY2VtZW50QXJyLmxlbmd0aCwgMSwgcHJpbWFyeVBsYWNlbWVudCArICctYm90dG9tJyk7XG4gICAgfVxuICAgIGlmICgod2luZG93LmlubmVySGVpZ2h0IHx8IGh0bWwuY2xpZW50SGVpZ2h0KSAtIGhvc3RFbGVtQ2xpZW50UmVjdC50b3AgPj0gdGFyZ2V0RWxlbUNsaWVudFJlY3QuaGVpZ2h0KSB7XG4gICAgICBhdmFpbGFibGVQbGFjZW1lbnRBcnIuc3BsaWNlKGF2YWlsYWJsZVBsYWNlbWVudEFyci5sZW5ndGgsIDEsIHByaW1hcnlQbGFjZW1lbnQgKyAnLXRvcCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBjaGVjayBpZiBzZWNvbmRhcnkgcGxhY2VtZW50IGZvciB0b3AgYW5kIGJvdHRvbSBhcmUgYXZhaWxhYmxlIGkuZS4gdG9wLWxlZnQsIHRvcC1yaWdodCwgYm90dG9tLWxlZnQsIGJvdHRvbS1yaWdodFxuICAgKiBwcmltYXJ5cGxhY2VtZW50OiB0b3B8Ym90dG9tXG4gICAqIGF2YWlsYWJsZVBsYWNlbWVudEFycjogYXJyYXkgaW4gd2hpY2ggYXZhaWxhYmxlIHBsYWNlbWVudHMgdG8gYmUgc2V0XG4gICAqL1xuICBwcml2YXRlIHNldFNlY29uZGFyeVBsYWNlbWVudEZvclRvcEJvdHRvbShcbiAgICAgIGhvc3RFbGVtQ2xpZW50UmVjdDogQ2xpZW50UmVjdCwgdGFyZ2V0RWxlbUNsaWVudFJlY3Q6IENsaWVudFJlY3QsIHByaW1hcnlQbGFjZW1lbnQ6IHN0cmluZyxcbiAgICAgIGF2YWlsYWJsZVBsYWNlbWVudEFycjogQXJyYXk8c3RyaW5nPikge1xuICAgIGxldCBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIC8vIGNoZWNrIGZvciBsZWZ0LWJvdHRvbVxuICAgIGlmICgod2luZG93LmlubmVyV2lkdGggfHwgaHRtbC5jbGllbnRXaWR0aCkgLSBob3N0RWxlbUNsaWVudFJlY3QubGVmdCA+PSB0YXJnZXRFbGVtQ2xpZW50UmVjdC53aWR0aCkge1xuICAgICAgYXZhaWxhYmxlUGxhY2VtZW50QXJyLnNwbGljZShhdmFpbGFibGVQbGFjZW1lbnRBcnIubGVuZ3RoLCAxLCBwcmltYXJ5UGxhY2VtZW50ICsgJy1sZWZ0Jyk7XG4gICAgfVxuICAgIGlmICh0YXJnZXRFbGVtQ2xpZW50UmVjdC53aWR0aCA8PSBob3N0RWxlbUNsaWVudFJlY3QucmlnaHQpIHtcbiAgICAgIGF2YWlsYWJsZVBsYWNlbWVudEFyci5zcGxpY2UoYXZhaWxhYmxlUGxhY2VtZW50QXJyLmxlbmd0aCwgMSwgcHJpbWFyeVBsYWNlbWVudCArICctcmlnaHQnKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgcG9zaXRpb25TZXJ2aWNlID0gbmV3IFBvc2l0aW9uaW5nKCk7XG5cbi8qXG4gKiBBY2NlcHQgdGhlIHBsYWNlbWVudCBhcnJheSBhbmQgYXBwbGllcyB0aGUgYXBwcm9wcmlhdGUgcGxhY2VtZW50IGRlcGVuZGVudCBvbiB0aGUgdmlld3BvcnQuXG4gKiBSZXR1cm5zIHRoZSBhcHBsaWVkIHBsYWNlbWVudC5cbiAqIEluIGNhc2Ugb2YgYXV0byBwbGFjZW1lbnQsIHBsYWNlbWVudHMgYXJlIHNlbGVjdGVkIGluIG9yZGVyXG4gKiAgICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnLFxuICogICAndG9wLWxlZnQnLCAndG9wLXJpZ2h0JyxcbiAqICAgJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCcsXG4gKiAgICdsZWZ0LXRvcCcsICdsZWZ0LWJvdHRvbScsXG4gKiAgICdyaWdodC10b3AnLCAncmlnaHQtYm90dG9tJy5cbiAqICovXG5leHBvcnQgZnVuY3Rpb24gcG9zaXRpb25FbGVtZW50cyhcbiAgICBob3N0RWxlbWVudDogSFRNTEVsZW1lbnQsIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50LCBwbGFjZW1lbnQ6IHN0cmluZyB8IFBsYWNlbWVudCB8IFBsYWNlbWVudEFycmF5LFxuICAgIGFwcGVuZFRvQm9keT86IGJvb2xlYW4pOiBQbGFjZW1lbnQge1xuICBsZXQgcGxhY2VtZW50VmFsczogQXJyYXk8UGxhY2VtZW50PiA9IEFycmF5LmlzQXJyYXkocGxhY2VtZW50KSA/IHBsYWNlbWVudCA6IFtwbGFjZW1lbnQgYXMgUGxhY2VtZW50XTtcblxuICAvLyByZXBsYWNlIGF1dG8gcGxhY2VtZW50IHdpdGggb3RoZXIgcGxhY2VtZW50c1xuICBsZXQgaGFzQXV0byA9IHBsYWNlbWVudFZhbHMuZmluZEluZGV4KHZhbCA9PiB2YWwgPT09ICdhdXRvJyk7XG4gIGlmIChoYXNBdXRvID49IDApIHtcbiAgICBbJ3RvcCcsICdib3R0b20nLCAnbGVmdCcsICdyaWdodCcsICd0b3AtbGVmdCcsICd0b3AtcmlnaHQnLCAnYm90dG9tLWxlZnQnLCAnYm90dG9tLXJpZ2h0JywgJ2xlZnQtdG9wJyxcbiAgICAgJ2xlZnQtYm90dG9tJywgJ3JpZ2h0LXRvcCcsICdyaWdodC1ib3R0b20nLFxuICAgIF0uZm9yRWFjaChmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmIChwbGFjZW1lbnRWYWxzLmZpbmQodmFsID0+IHZhbC5zZWFyY2goJ14nICsgb2JqKSAhPT0gLTEpID09IG51bGwpIHtcbiAgICAgICAgcGxhY2VtZW50VmFscy5zcGxpY2UoaGFzQXV0bysrLCAxLCBvYmogYXMgUGxhY2VtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGNvb3JkaW5hdGVzIHdoZXJlIHRvIHBvc2l0aW9uXG4gIGxldCB0b3BWYWwgPSAwLCBsZWZ0VmFsID0gMDtcbiAgbGV0IGFwcGxpZWRQbGFjZW1lbnQ6IFBsYWNlbWVudDtcbiAgLy8gZ2V0IGF2YWlsYWJsZSBwbGFjZW1lbnRzXG4gIGxldCBhdmFpbGFibGVQbGFjZW1lbnRzID0gcG9zaXRpb25TZXJ2aWNlLmdldEF2YWlsYWJsZVBsYWNlbWVudHMoaG9zdEVsZW1lbnQsIHRhcmdldEVsZW1lbnQpO1xuICAvLyBpdGVyYXRlIG92ZXIgYWxsIHRoZSBwYXNzZWQgcGxhY2VtZW50c1xuICBmb3IgKGxldCB7IGl0ZW0sIGluZGV4IH0gb2YgdG9JdGVtSW5kZXhlcyhwbGFjZW1lbnRWYWxzKSkge1xuICAgIC8vIGNoZWNrIGlmIHBhc3NlZCBwbGFjZW1lbnQgaXMgcHJlc2VudCBpbiB0aGUgYXZhaWxhYmxlIHBsYWNlbWVudCBvciBvdGhlcndpc2UgYXBwbHkgdGhlIGxhc3QgcGxhY2VtZW50IGluIHRoZVxuICAgIC8vIHBhc3NlZCBwbGFjZW1lbnQgbGlzdFxuICAgIGlmICgoYXZhaWxhYmxlUGxhY2VtZW50cy5maW5kKHZhbCA9PiB2YWwgPT09IGl0ZW0pICE9IG51bGwpIHx8IChwbGFjZW1lbnRWYWxzLmxlbmd0aCA9PT0gaW5kZXggKyAxKSkge1xuICAgICAgYXBwbGllZFBsYWNlbWVudCA9IDxQbGFjZW1lbnQ+aXRlbTtcbiAgICAgIGNvbnN0IHBvcyA9IHBvc2l0aW9uU2VydmljZS5wb3NpdGlvbkVsZW1lbnRzKGhvc3RFbGVtZW50LCB0YXJnZXRFbGVtZW50LCBpdGVtLCBhcHBlbmRUb0JvZHkpO1xuICAgICAgdG9wVmFsID0gcG9zLnRvcDtcbiAgICAgIGxlZnRWYWwgPSBwb3MubGVmdDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB0YXJnZXRFbGVtZW50LnN0eWxlLnRvcCA9IGAke3RvcFZhbH1weGA7XG4gIHRhcmdldEVsZW1lbnQuc3R5bGUubGVmdCA9IGAke2xlZnRWYWx9cHhgO1xuICByZXR1cm4gYXBwbGllZFBsYWNlbWVudDtcbn1cblxuLy8gZnVuY3Rpb24gdG8gZ2V0IGluZGV4IGFuZCBpdGVtIG9mIGFuIGFycmF5XG5mdW5jdGlvbiB0b0l0ZW1JbmRleGVzPFQ+KGE6IFRbXSkge1xuICByZXR1cm4gYS5tYXAoKGl0ZW0sIGluZGV4KSA9PiAoe2l0ZW0sIGluZGV4fSkpO1xufVxuXG5leHBvcnQgdHlwZSBQbGFjZW1lbnQgPSAnYXV0bycgfCAndG9wJyB8ICdib3R0b20nIHwgJ2xlZnQnIHwgJ3JpZ2h0JyB8ICd0b3AtbGVmdCcgfCAndG9wLXJpZ2h0JyB8ICdib3R0b20tbGVmdCcgfFxuICAgICdib3R0b20tcmlnaHQnIHwgJ2xlZnQtdG9wJyB8ICdsZWZ0LWJvdHRvbScgfCAncmlnaHQtdG9wJyB8ICdyaWdodC1ib3R0b20nO1xuXG5leHBvcnQgdHlwZSBQbGFjZW1lbnRBcnJheSA9IFBsYWNlbWVudCB8IEFycmF5PFBsYWNlbWVudD47XG4iLCJpbXBvcnQge3BhZE51bWJlciwgdG9JbnRlZ2VyLCBpc051bWJlcn0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGZ1bmN0aW9uIE5HQl9EQVRFUElDS0VSX1BBUlNFUl9GT1JNQVRURVJfRkFDVE9SWSgpIHtcbiAgcmV0dXJuIG5ldyBOZ2JEYXRlSVNPUGFyc2VyRm9ybWF0dGVyKCk7XG59XG5cbi8qKlxuICogQWJzdHJhY3QgdHlwZSBzZXJ2aW5nIGFzIGEgREkgdG9rZW4gZm9yIHRoZSBzZXJ2aWNlIHBhcnNpbmcgYW5kIGZvcm1hdHRpbmcgZGF0ZXMgZm9yIHRoZSBOZ2JJbnB1dERhdGVwaWNrZXJcbiAqIGRpcmVjdGl2ZS4gQSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIHVzaW5nIHRoZSBJU08gODYwMSBmb3JtYXQgaXMgcHJvdmlkZWQsIGJ1dCB5b3UgY2FuIHByb3ZpZGUgYW5vdGhlciBpbXBsZW1lbnRhdGlvblxuICogdG8gdXNlIGFuIGFsdGVybmF0aXZlIGZvcm1hdC5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290JywgdXNlRmFjdG9yeTogTkdCX0RBVEVQSUNLRVJfUEFSU0VSX0ZPUk1BVFRFUl9GQUNUT1JZfSlcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOZ2JEYXRlUGFyc2VyRm9ybWF0dGVyIHtcbiAgLyoqXG4gICAqIFBhcnNlcyB0aGUgZ2l2ZW4gdmFsdWUgdG8gYW4gTmdiRGF0ZVN0cnVjdC4gSW1wbGVtZW50YXRpb25zIHNob3VsZCB0cnkgdGhlaXIgYmVzdCB0byBwcm92aWRlIGEgcmVzdWx0LCBldmVuXG4gICAqIHBhcnRpYWwuIFRoZXkgbXVzdCByZXR1cm4gbnVsbCBpZiB0aGUgdmFsdWUgY2FuJ3QgYmUgcGFyc2VkLlxuICAgKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHRvIHBhcnNlXG4gICAqL1xuICBhYnN0cmFjdCBwYXJzZSh2YWx1ZTogc3RyaW5nKTogTmdiRGF0ZVN0cnVjdDtcblxuICAvKipcbiAgICogRm9ybWF0cyB0aGUgZ2l2ZW4gZGF0ZSB0byBhIHN0cmluZy4gSW1wbGVtZW50YXRpb25zIHNob3VsZCByZXR1cm4gYW4gZW1wdHkgc3RyaW5nIGlmIHRoZSBnaXZlbiBkYXRlIGlzIG51bGwsXG4gICAqIGFuZCB0cnkgdGhlaXIgYmVzdCB0byBwcm92aWRlIGEgcGFydGlhbCByZXN1bHQgaWYgdGhlIGdpdmVuIGRhdGUgaXMgaW5jb21wbGV0ZSBvciBpbnZhbGlkLlxuICAgKiBAcGFyYW0gZGF0ZSB0aGUgZGF0ZSB0byBmb3JtYXQgYXMgYSBzdHJpbmdcbiAgICovXG4gIGFic3RyYWN0IGZvcm1hdChkYXRlOiBOZ2JEYXRlU3RydWN0KTogc3RyaW5nO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdiRGF0ZUlTT1BhcnNlckZvcm1hdHRlciBleHRlbmRzIE5nYkRhdGVQYXJzZXJGb3JtYXR0ZXIge1xuICBwYXJzZSh2YWx1ZTogc3RyaW5nKTogTmdiRGF0ZVN0cnVjdCB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBjb25zdCBkYXRlUGFydHMgPSB2YWx1ZS50cmltKCkuc3BsaXQoJy0nKTtcbiAgICAgIGlmIChkYXRlUGFydHMubGVuZ3RoID09PSAxICYmIGlzTnVtYmVyKGRhdGVQYXJ0c1swXSkpIHtcbiAgICAgICAgcmV0dXJuIHt5ZWFyOiB0b0ludGVnZXIoZGF0ZVBhcnRzWzBdKSwgbW9udGg6IG51bGwsIGRheTogbnVsbH07XG4gICAgICB9IGVsc2UgaWYgKGRhdGVQYXJ0cy5sZW5ndGggPT09IDIgJiYgaXNOdW1iZXIoZGF0ZVBhcnRzWzBdKSAmJiBpc051bWJlcihkYXRlUGFydHNbMV0pKSB7XG4gICAgICAgIHJldHVybiB7eWVhcjogdG9JbnRlZ2VyKGRhdGVQYXJ0c1swXSksIG1vbnRoOiB0b0ludGVnZXIoZGF0ZVBhcnRzWzFdKSwgZGF5OiBudWxsfTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0ZVBhcnRzLmxlbmd0aCA9PT0gMyAmJiBpc051bWJlcihkYXRlUGFydHNbMF0pICYmIGlzTnVtYmVyKGRhdGVQYXJ0c1sxXSkgJiYgaXNOdW1iZXIoZGF0ZVBhcnRzWzJdKSkge1xuICAgICAgICByZXR1cm4ge3llYXI6IHRvSW50ZWdlcihkYXRlUGFydHNbMF0pLCBtb250aDogdG9JbnRlZ2VyKGRhdGVQYXJ0c1sxXSksIGRheTogdG9JbnRlZ2VyKGRhdGVQYXJ0c1syXSl9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGZvcm1hdChkYXRlOiBOZ2JEYXRlU3RydWN0KTogc3RyaW5nIHtcbiAgICByZXR1cm4gZGF0ZSA/XG4gICAgICAgIGAke2RhdGUueWVhcn0tJHtpc051bWJlcihkYXRlLm1vbnRoKSA/IHBhZE51bWJlcihkYXRlLm1vbnRoKSA6ICcnfS0ke2lzTnVtYmVyKGRhdGUuZGF5KSA/IHBhZE51bWJlcihkYXRlLmRheSkgOiAnJ31gIDpcbiAgICAgICAgJyc7XG4gIH1cbn1cbiIsImltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIENvbXBvbmVudFJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTElEQVRPUlMsIE5HX1ZBTFVFX0FDQ0VTU09SLCBWYWxpZGF0b3J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7ZnJvbUV2ZW50LCBORVZFUiwgcmFjZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7bmdiRm9jdXNUcmFwfSBmcm9tICcuLi91dGlsL2ZvY3VzLXRyYXAnO1xuaW1wb3J0IHtLZXl9IGZyb20gJy4uL3V0aWwva2V5JztcbmltcG9ydCB7UGxhY2VtZW50QXJyYXksIHBvc2l0aW9uRWxlbWVudHN9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmcnO1xuaW1wb3J0IHtOZ2JEYXRlQWRhcHRlcn0gZnJvbSAnLi9hZGFwdGVycy9uZ2ItZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlciwgTmdiRGF0ZXBpY2tlck5hdmlnYXRlRXZlbnR9IGZyb20gJy4vZGF0ZXBpY2tlcic7XG5pbXBvcnQge0RheVRlbXBsYXRlQ29udGV4dH0gZnJvbSAnLi9kYXRlcGlja2VyLWRheS10ZW1wbGF0ZS1jb250ZXh0JztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlclNlcnZpY2V9IGZyb20gJy4vZGF0ZXBpY2tlci1zZXJ2aWNlJztcbmltcG9ydCB7TmdiQ2FsZW5kYXJ9IGZyb20gJy4vbmdiLWNhbGVuZGFyJztcbmltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge05nYkRhdGVQYXJzZXJGb3JtYXR0ZXJ9IGZyb20gJy4vbmdiLWRhdGUtcGFyc2VyLWZvcm1hdHRlcic7XG5pbXBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcblxuY29uc3QgTkdCX0RBVEVQSUNLRVJfVkFMVUVfQUNDRVNTT1IgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ2JJbnB1dERhdGVwaWNrZXIpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuY29uc3QgTkdCX0RBVEVQSUNLRVJfVkFMSURBVE9SID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ2JJbnB1dERhdGVwaWNrZXIpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IG1ha2VzIGl0IHBvc3NpYmxlIHRvIGhhdmUgZGF0ZXBpY2tlcnMgb24gaW5wdXQgZmllbGRzLlxuICogTWFuYWdlcyBpbnRlZ3JhdGlvbiB3aXRoIHRoZSBpbnB1dCBmaWVsZCBpdHNlbGYgKGRhdGEgZW50cnkpIGFuZCBuZ01vZGVsICh2YWxpZGF0aW9uIGV0Yy4pLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFtuZ2JEYXRlcGlja2VyXScsXG4gIGV4cG9ydEFzOiAnbmdiRGF0ZXBpY2tlcicsXG4gIGhvc3Q6IHtcbiAgICAnKGlucHV0KSc6ICdtYW51YWxEYXRlQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnbWFudWFsRGF0ZUNoYW5nZSgkZXZlbnQudGFyZ2V0LnZhbHVlLCB0cnVlKScsXG4gICAgJyhibHVyKSc6ICdvbkJsdXIoKScsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnXG4gIH0sXG4gIHByb3ZpZGVyczogW05HQl9EQVRFUElDS0VSX1ZBTFVFX0FDQ0VTU09SLCBOR0JfREFURVBJQ0tFUl9WQUxJREFUT1IsIE5nYkRhdGVwaWNrZXJTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JJbnB1dERhdGVwaWNrZXIgaW1wbGVtZW50cyBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgVmFsaWRhdG9yIHtcbiAgcHJpdmF0ZSBfY2xvc2VkJCA9IG5ldyBTdWJqZWN0KCk7XG4gIHByaXZhdGUgX2NSZWY6IENvbXBvbmVudFJlZjxOZ2JEYXRlcGlja2VyPiA9IG51bGw7XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX21vZGVsOiBOZ2JEYXRlO1xuICBwcml2YXRlIF9pbnB1dFZhbHVlOiBzdHJpbmc7XG4gIHByaXZhdGUgX3pvbmVTdWJzY3JpcHRpb246IGFueTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgcG9wdXAgc2hvdWxkIGJlIGNsb3NlZCBhdXRvbWF0aWNhbGx5IGFmdGVyIGRhdGUgc2VsZWN0aW9uIC8gb3V0c2lkZSBjbGljayBvciBub3QuXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQgdGhlIHBvcHVwIHdpbGwgY2xvc2Ugb24gYm90aCBkYXRlIHNlbGVjdGlvbiBhbmQgb3V0c2lkZSBjbGljay4gSWYgdGhlIHZhbHVlIGlzICdmYWxzZScgdGhlIHBvcHVwIGhhcyB0b1xuICAgKiBiZSBjbG9zZWQgbWFudWFsbHkgdmlhICcuY2xvc2UoKScgb3IgJy50b2dnbGUoKScgbWV0aG9kcy4gSWYgdGhlIHZhbHVlIGlzIHNldCB0byAnaW5zaWRlJyB0aGUgcG9wdXAgd2lsbCBjbG9zZSBvblxuICAgKiBkYXRlIHNlbGVjdGlvbiBvbmx5LiBGb3IgdGhlICdvdXRzaWRlJyB0aGUgcG9wdXAgd2lsbCBjbG9zZSBvbmx5IG9uIHRoZSBvdXRzaWRlIGNsaWNrLlxuICAgKlxuICAgKiBAc2luY2UgMy4wLjBcbiAgICovXG4gIEBJbnB1dCgpIGF1dG9DbG9zZTogYm9vbGVhbiB8ICdpbnNpZGUnIHwgJ291dHNpZGUnID0gdHJ1ZTtcblxuICAvKipcbiAgICogUmVmZXJlbmNlIGZvciB0aGUgY3VzdG9tIHRlbXBsYXRlIGZvciB0aGUgZGF5IGRpc3BsYXlcbiAgICovXG4gIEBJbnB1dCgpIGRheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxEYXlUZW1wbGF0ZUNvbnRleHQ+O1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byBwYXNzIGFueSBhcmJpdHJhcnkgZGF0YSB0byB0aGUgY3VzdG9tIGRheSB0ZW1wbGF0ZSBjb250ZXh0XG4gICAqICdDdXJyZW50JyBjb250YWlucyB0aGUgbW9udGggdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBpbiB0aGUgdmlld1xuICAgKlxuICAgKiBAc2luY2UgMy4zLjBcbiAgICovXG4gIEBJbnB1dCgpIGRheVRlbXBsYXRlRGF0YTogKGRhdGU6IE5nYkRhdGUsIGN1cnJlbnQ6IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9KSA9PiBhbnk7XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiBtb250aHMgdG8gZGlzcGxheVxuICAgKi9cbiAgQElucHV0KCkgZGlzcGxheU1vbnRoczogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBGaXJzdCBkYXkgb2YgdGhlIHdlZWsuIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6IDE9TW9uIC4uLiA3PVN1blxuICAgKi9cbiAgQElucHV0KCkgZmlyc3REYXlPZldlZWs6IG51bWJlcjtcblxuICAvKipcbiAgICogUmVmZXJlbmNlIGZvciB0aGUgY3VzdG9tIHRlbXBsYXRlIGZvciB0aGUgZm9vdGVyIGluc2lkZSBkYXRlcGlja2VyXG4gICAqXG4gICAqIEBzaW5jZSAzLjMuMFxuICAgKi9cbiAgQElucHV0KCkgZm9vdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIG1hcmsgYSBnaXZlbiBkYXRlIGFzIGRpc2FibGVkLlxuICAgKiAnQ3VycmVudCcgY29udGFpbnMgdGhlIG1vbnRoIHRoYXQgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gdGhlIHZpZXdcbiAgICovXG4gIEBJbnB1dCgpIG1hcmtEaXNhYmxlZDogKGRhdGU6IE5nYkRhdGUsIGN1cnJlbnQ6IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9KSA9PiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBNaW4gZGF0ZSBmb3IgdGhlIG5hdmlnYXRpb24uIElmIG5vdCBwcm92aWRlZCB3aWxsIGJlIDEwIHllYXJzIGJlZm9yZSB0b2RheSBvciBgc3RhcnREYXRlYFxuICAgKi9cbiAgQElucHV0KCkgbWluRGF0ZTogTmdiRGF0ZVN0cnVjdDtcblxuICAvKipcbiAgICogTWF4IGRhdGUgZm9yIHRoZSBuYXZpZ2F0aW9uLiBJZiBub3QgcHJvdmlkZWQgd2lsbCBiZSAxMCB5ZWFycyBmcm9tIHRvZGF5IG9yIGBzdGFydERhdGVgXG4gICAqL1xuICBASW5wdXQoKSBtYXhEYXRlOiBOZ2JEYXRlU3RydWN0O1xuXG4gIC8qKlxuICAgKiBOYXZpZ2F0aW9uIHR5cGU6IGBzZWxlY3RgIChkZWZhdWx0IHdpdGggc2VsZWN0IGJveGVzIGZvciBtb250aCBhbmQgeWVhciksIGBhcnJvd3NgXG4gICAqICh3aXRob3V0IHNlbGVjdCBib3hlcywgb25seSBuYXZpZ2F0aW9uIGFycm93cykgb3IgYG5vbmVgIChubyBuYXZpZ2F0aW9uIGF0IGFsbClcbiAgICovXG4gIEBJbnB1dCgpIG5hdmlnYXRpb246ICdzZWxlY3QnIHwgJ2Fycm93cycgfCAnbm9uZSc7XG5cbiAgLyoqXG4gICAqIFRoZSB3YXkgdG8gZGlzcGxheSBkYXlzIHRoYXQgZG9uJ3QgYmVsb25nIHRvIGN1cnJlbnQgbW9udGg6IGB2aXNpYmxlYCAoZGVmYXVsdCksXG4gICAqIGBoaWRkZW5gIChub3QgZGlzcGxheWVkKSBvciBgY29sbGFwc2VkYCAobm90IGRpc3BsYXllZCB3aXRoIGVtcHR5IHNwYWNlIGNvbGxhcHNlZClcbiAgICovXG4gIEBJbnB1dCgpIG91dHNpZGVEYXlzOiAndmlzaWJsZScgfCAnY29sbGFwc2VkJyB8ICdoaWRkZW4nO1xuXG4gIC8qKlxuICAgKiBQbGFjZW1lbnQgb2YgYSBkYXRlcGlja2VyIHBvcHVwIGFjY2VwdHM6XG4gICAqICAgIFwidG9wXCIsIFwidG9wLWxlZnRcIiwgXCJ0b3AtcmlnaHRcIiwgXCJib3R0b21cIiwgXCJib3R0b20tbGVmdFwiLCBcImJvdHRvbS1yaWdodFwiLFxuICAgKiAgICBcImxlZnRcIiwgXCJsZWZ0LXRvcFwiLCBcImxlZnQtYm90dG9tXCIsIFwicmlnaHRcIiwgXCJyaWdodC10b3BcIiwgXCJyaWdodC1ib3R0b21cIlxuICAgKiBhbmQgYXJyYXkgb2YgYWJvdmUgdmFsdWVzLlxuICAgKi9cbiAgQElucHV0KCkgcGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSA9ICdib3R0b20tbGVmdCc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzcGxheSBkYXlzIG9mIHRoZSB3ZWVrXG4gICAqL1xuICBASW5wdXQoKSBzaG93V2Vla2RheXM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzcGxheSB3ZWVrIG51bWJlcnNcbiAgICovXG4gIEBJbnB1dCgpIHNob3dXZWVrTnVtYmVyczogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGF0ZSB0byBvcGVuIGNhbGVuZGFyIHdpdGguXG4gICAqIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICdtb250aCcgaXMgMT1KYW4gLi4uIDEyPURlYy5cbiAgICogSWYgbm90aGluZyBvciBpbnZhbGlkIGRhdGUgcHJvdmlkZWQsIGNhbGVuZGFyIHdpbGwgb3BlbiB3aXRoIGN1cnJlbnQgbW9udGguXG4gICAqIFVzZSAnbmF2aWdhdGVUbyhkYXRlKScgYXMgYW4gYWx0ZXJuYXRpdmVcbiAgICovXG4gIEBJbnB1dCgpIHN0YXJ0RGF0ZToge3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlciwgZGF5PzogbnVtYmVyfTtcblxuICAvKipcbiAgICogQSBzZWxlY3RvciBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSBkYXRlcGlja2VyIHBvcHVwIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cbiAgICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgXCJib2R5XCIuXG4gICAqL1xuICBASW5wdXQoKSBjb250YWluZXI6IHN0cmluZztcblxuICAvKipcbiAgICogQW4gZXZlbnQgZmlyZWQgd2hlbiB1c2VyIHNlbGVjdHMgYSBkYXRlIHVzaW5nIGtleWJvYXJkIG9yIG1vdXNlLlxuICAgKiBUaGUgcGF5bG9hZCBvZiB0aGUgZXZlbnQgaXMgY3VycmVudGx5IHNlbGVjdGVkIE5nYkRhdGUuXG4gICAqXG4gICAqIEBzaW5jZSAxLjEuMVxuICAgKi9cbiAgQE91dHB1dCgpIGRhdGVTZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYkRhdGU+KCk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGZpcmVkIHdoZW4gbmF2aWdhdGlvbiBoYXBwZW5zIGFuZCBjdXJyZW50bHkgZGlzcGxheWVkIG1vbnRoIGNoYW5nZXMuXG4gICAqIFNlZSBOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudCBmb3IgdGhlIHBheWxvYWQgaW5mby5cbiAgICovXG4gIEBPdXRwdXQoKSBuYXZpZ2F0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiRGF0ZXBpY2tlck5hdmlnYXRlRXZlbnQ+KCk7XG5cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWUgPT09ICcnIHx8ICh2YWx1ZSAmJiB2YWx1ZSAhPT0gJ2ZhbHNlJyk7XG5cbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgdGhpcy5fY1JlZi5pbnN0YW5jZS5zZXREaXNhYmxlZFN0YXRlKHRoaXMuX2Rpc2FibGVkKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9vbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuICBwcml2YXRlIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yQ2hhbmdlID0gKCkgPT4ge307XG5cblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX3BhcnNlckZvcm1hdHRlcjogTmdiRGF0ZVBhcnNlckZvcm1hdHRlciwgcHJpdmF0ZSBfZWxSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgICBwcml2YXRlIF92Y1JlZjogVmlld0NvbnRhaW5lclJlZiwgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBfY2ZyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSwgcHJpdmF0ZSBfc2VydmljZTogTmdiRGF0ZXBpY2tlclNlcnZpY2UsIHByaXZhdGUgX2NhbGVuZGFyOiBOZ2JDYWxlbmRhcixcbiAgICAgIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBOZ2JEYXRlQWRhcHRlcjxhbnk+LCBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55KSB7XG4gICAgdGhpcy5fem9uZVN1YnNjcmlwdGlvbiA9IF9uZ1pvbmUub25TdGFibGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9jUmVmKSB7XG4gICAgICAgIHBvc2l0aW9uRWxlbWVudHMoXG4gICAgICAgICAgICB0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl9jUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsIHRoaXMucGxhY2VtZW50LCB0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5fb25DaGFuZ2UgPSBmbjsgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5fb25Ub3VjaGVkID0gZm47IH1cblxuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX3ZhbGlkYXRvckNoYW5nZSA9IGZuOyB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7IHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkOyB9XG5cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICAgIGNvbnN0IHZhbHVlID0gYy52YWx1ZTtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBuZ2JEYXRlID0gdGhpcy5fZnJvbURhdGVTdHJ1Y3QodGhpcy5fZGF0ZUFkYXB0ZXIuZnJvbU1vZGVsKHZhbHVlKSk7XG5cbiAgICBpZiAoIXRoaXMuX2NhbGVuZGFyLmlzVmFsaWQobmdiRGF0ZSkpIHtcbiAgICAgIHJldHVybiB7J25nYkRhdGUnOiB7aW52YWxpZDogYy52YWx1ZX19O1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1pbkRhdGUgJiYgbmdiRGF0ZS5iZWZvcmUoTmdiRGF0ZS5mcm9tKHRoaXMubWluRGF0ZSkpKSB7XG4gICAgICByZXR1cm4geyduZ2JEYXRlJzoge3JlcXVpcmVkQmVmb3JlOiB0aGlzLm1pbkRhdGV9fTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXhEYXRlICYmIG5nYkRhdGUuYWZ0ZXIoTmdiRGF0ZS5mcm9tKHRoaXMubWF4RGF0ZSkpKSB7XG4gICAgICByZXR1cm4geyduZ2JEYXRlJzoge3JlcXVpcmVkQWZ0ZXI6IHRoaXMubWF4RGF0ZX19O1xuICAgIH1cbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLl9tb2RlbCA9IHRoaXMuX2Zyb21EYXRlU3RydWN0KHRoaXMuX2RhdGVBZGFwdGVyLmZyb21Nb2RlbCh2YWx1ZSkpO1xuICAgIHRoaXMuX3dyaXRlTW9kZWxWYWx1ZSh0aGlzLl9tb2RlbCk7XG4gIH1cblxuICBtYW51YWxEYXRlQ2hhbmdlKHZhbHVlOiBzdHJpbmcsIHVwZGF0ZVZpZXcgPSBmYWxzZSkge1xuICAgIGNvbnN0IGlucHV0VmFsdWVDaGFuZ2VkID0gdmFsdWUgIT09IHRoaXMuX2lucHV0VmFsdWU7XG4gICAgaWYgKGlucHV0VmFsdWVDaGFuZ2VkKSB7XG4gICAgICB0aGlzLl9pbnB1dFZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl9tb2RlbCA9IHRoaXMuX2Zyb21EYXRlU3RydWN0KHRoaXMuX3BhcnNlckZvcm1hdHRlci5wYXJzZSh2YWx1ZSkpO1xuICAgIH1cbiAgICBpZiAoaW5wdXRWYWx1ZUNoYW5nZWQgfHwgIXVwZGF0ZVZpZXcpIHtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKHRoaXMuX21vZGVsID8gdGhpcy5fZGF0ZUFkYXB0ZXIudG9Nb2RlbCh0aGlzLl9tb2RlbCkgOiAodmFsdWUgPT09ICcnID8gbnVsbCA6IHZhbHVlKSk7XG4gICAgfVxuICAgIGlmICh1cGRhdGVWaWV3ICYmIHRoaXMuX21vZGVsKSB7XG4gICAgICB0aGlzLl93cml0ZU1vZGVsVmFsdWUodGhpcy5fbW9kZWwpO1xuICAgIH1cbiAgfVxuXG4gIGlzT3BlbigpIHsgcmV0dXJuICEhdGhpcy5fY1JlZjsgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgZGF0ZXBpY2tlciB3aXRoIHRoZSBzZWxlY3RlZCBkYXRlIGluZGljYXRlZCBieSB0aGUgbmdNb2RlbCB2YWx1ZS5cbiAgICovXG4gIG9wZW4oKSB7XG4gICAgaWYgKCF0aGlzLmlzT3BlbigpKSB7XG4gICAgICBjb25zdCBjZiA9IHRoaXMuX2Nmci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShOZ2JEYXRlcGlja2VyKTtcbiAgICAgIHRoaXMuX2NSZWYgPSB0aGlzLl92Y1JlZi5jcmVhdGVDb21wb25lbnQoY2YpO1xuXG4gICAgICB0aGlzLl9hcHBseVBvcHVwU3R5bGluZyh0aGlzLl9jUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgdGhpcy5fYXBwbHlEYXRlcGlja2VySW5wdXRzKHRoaXMuX2NSZWYuaW5zdGFuY2UpO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlRm9yRGF0ZXBpY2tlck91dHB1dHModGhpcy5fY1JlZi5pbnN0YW5jZSk7XG4gICAgICB0aGlzLl9jUmVmLmluc3RhbmNlLm5nT25Jbml0KCk7XG4gICAgICB0aGlzLl9jUmVmLmluc3RhbmNlLndyaXRlVmFsdWUodGhpcy5fZGF0ZUFkYXB0ZXIudG9Nb2RlbCh0aGlzLl9tb2RlbCkpO1xuXG4gICAgICAvLyBkYXRlIHNlbGVjdGlvbiBldmVudCBoYW5kbGluZ1xuICAgICAgdGhpcy5fY1JlZi5pbnN0YW5jZS5yZWdpc3Rlck9uQ2hhbmdlKChzZWxlY3RlZERhdGUpID0+IHtcbiAgICAgICAgdGhpcy53cml0ZVZhbHVlKHNlbGVjdGVkRGF0ZSk7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlKHNlbGVjdGVkRGF0ZSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fY1JlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgIHRoaXMuX2NSZWYuaW5zdGFuY2Uuc2V0RGlzYWJsZWRTdGF0ZSh0aGlzLmRpc2FibGVkKTtcblxuICAgICAgaWYgKHRoaXMuY29udGFpbmVyID09PSAnYm9keScpIHtcbiAgICAgICAgd2luZG93LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jb250YWluZXIpLmFwcGVuZENoaWxkKHRoaXMuX2NSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGZvY3VzIGhhbmRsaW5nXG4gICAgICBuZ2JGb2N1c1RyYXAodGhpcy5fY1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LCB0aGlzLl9jbG9zZWQkLCB0cnVlKTtcblxuICAgICAgdGhpcy5fY1JlZi5pbnN0YW5jZS5mb2N1cygpO1xuXG4gICAgICAvLyBjbG9zaW5nIG9uIEVTQyBhbmQgb3V0c2lkZSBjbGlja3NcbiAgICAgIGlmICh0aGlzLmF1dG9DbG9zZSkge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXG4gICAgICAgICAgY29uc3QgZXNjYXBlcyQgPSBmcm9tRXZlbnQ8S2V5Ym9hcmRFdmVudD4odGhpcy5fZG9jdW1lbnQsICdrZXl1cCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9jbG9zZWQkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRlcHJlY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcihlID0+IGUud2hpY2ggPT09IEtleS5Fc2NhcGUpKTtcblxuICAgICAgICAgIGxldCBvdXRzaWRlQ2xpY2tzJDtcbiAgICAgICAgICBpZiAodGhpcy5hdXRvQ2xvc2UgPT09IHRydWUgfHwgdGhpcy5hdXRvQ2xvc2UgPT09ICdvdXRzaWRlJykge1xuICAgICAgICAgICAgLy8gd2UgZG9uJ3Qga25vdyBob3cgdGhlIHBvcHVwIHdhcyBvcGVuZWQsIHNvIGlmIGl0IHdhcyBvcGVuZWQgd2l0aCBhIGNsaWNrLFxuICAgICAgICAgICAgLy8gd2UgaGF2ZSB0byBza2lwIHRoZSBmaXJzdCBvbmUgdG8gYXZvaWQgY2xvc2luZyBpdCBpbW1lZGlhdGVseVxuICAgICAgICAgICAgbGV0IGlzT3BlbmluZyA9IHRydWU7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gaXNPcGVuaW5nID0gZmFsc2UpO1xuXG4gICAgICAgICAgICBvdXRzaWRlQ2xpY2tzJCA9IGZyb21FdmVudDxNb3VzZUV2ZW50Pih0aGlzLl9kb2N1bWVudCwgJ2NsaWNrJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9jbG9zZWQkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gIWlzT3BlbmluZyAmJiB0aGlzLl9zaG91bGRDbG9zZU9uT3V0c2lkZUNsaWNrKGV2ZW50KSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRzaWRlQ2xpY2tzJCA9IE5FVkVSO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJhY2U8RXZlbnQ+KFtlc2NhcGVzJCwgb3V0c2lkZUNsaWNrcyRdKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmNsb3NlKCkpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgZGF0ZXBpY2tlciBwb3B1cC5cbiAgICovXG4gIGNsb3NlKCkge1xuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLl92Y1JlZi5yZW1vdmUodGhpcy5fdmNSZWYuaW5kZXhPZih0aGlzLl9jUmVmLmhvc3RWaWV3KSk7XG4gICAgICB0aGlzLl9jUmVmID0gbnVsbDtcbiAgICAgIHRoaXMuX2Nsb3NlZCQubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBkYXRlcGlja2VyIHBvcHVwIChvcGVucyB3aGVuIGNsb3NlZCBhbmQgY2xvc2VzIHdoZW4gb3BlbmVkKS5cbiAgICovXG4gIHRvZ2dsZSgpIHtcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTmF2aWdhdGVzIGN1cnJlbnQgdmlldyB0byBwcm92aWRlZCBkYXRlLlxuICAgKiBXaXRoIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnbW9udGgnIGlzIDE9SmFuIC4uLiAxMj1EZWMuXG4gICAqIElmIG5vdGhpbmcgb3IgaW52YWxpZCBkYXRlIHByb3ZpZGVkIGNhbGVuZGFyIHdpbGwgb3BlbiBjdXJyZW50IG1vbnRoLlxuICAgKiBVc2UgJ3N0YXJ0RGF0ZScgaW5wdXQgYXMgYW4gYWx0ZXJuYXRpdmVcbiAgICovXG4gIG5hdmlnYXRlVG8oZGF0ZT86IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXIsIGRheT86IG51bWJlcn0pIHtcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgdGhpcy5fY1JlZi5pbnN0YW5jZS5uYXZpZ2F0ZVRvKGRhdGUpO1xuICAgIH1cbiAgfVxuXG4gIG9uQmx1cigpIHsgdGhpcy5fb25Ub3VjaGVkKCk7IH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ21pbkRhdGUnXSB8fCBjaGFuZ2VzWydtYXhEYXRlJ10pIHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRvckNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcml2YXRlIF9hcHBseURhdGVwaWNrZXJJbnB1dHMoZGF0ZXBpY2tlckluc3RhbmNlOiBOZ2JEYXRlcGlja2VyKTogdm9pZCB7XG4gICAgWydkYXlUZW1wbGF0ZScsICdkYXlUZW1wbGF0ZURhdGEnLCAnZGlzcGxheU1vbnRocycsICdmaXJzdERheU9mV2VlaycsICdmb290ZXJUZW1wbGF0ZScsICdtYXJrRGlzYWJsZWQnLCAnbWluRGF0ZScsXG4gICAgICdtYXhEYXRlJywgJ25hdmlnYXRpb24nLCAnb3V0c2lkZURheXMnLCAnc2hvd05hdmlnYXRpb24nLCAnc2hvd1dlZWtkYXlzJywgJ3Nob3dXZWVrTnVtYmVycyddXG4gICAgICAgIC5mb3JFYWNoKChvcHRpb25OYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBpZiAodGhpc1tvcHRpb25OYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkYXRlcGlja2VySW5zdGFuY2Vbb3B0aW9uTmFtZV0gPSB0aGlzW29wdGlvbk5hbWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgZGF0ZXBpY2tlckluc3RhbmNlLnN0YXJ0RGF0ZSA9IHRoaXMuc3RhcnREYXRlIHx8IHRoaXMuX21vZGVsO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlQb3B1cFN0eWxpbmcobmF0aXZlRWxlbWVudDogYW55KSB7XG4gICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3MobmF0aXZlRWxlbWVudCwgJ2Ryb3Bkb3duLW1lbnUnKTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShuYXRpdmVFbGVtZW50LCAncGFkZGluZycsICcwJyk7XG4gICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3MobmF0aXZlRWxlbWVudCwgJ3Nob3cnKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Nob3VsZENsb3NlT25PdXRzaWRlQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICByZXR1cm4gIVt0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl9jUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnRdLnNvbWUoZWwgPT4gZWwuY29udGFpbnMoZXZlbnQudGFyZ2V0KSk7XG4gIH1cblxuICBwcml2YXRlIF9zdWJzY3JpYmVGb3JEYXRlcGlja2VyT3V0cHV0cyhkYXRlcGlja2VySW5zdGFuY2U6IE5nYkRhdGVwaWNrZXIpIHtcbiAgICBkYXRlcGlja2VySW5zdGFuY2UubmF2aWdhdGUuc3Vic2NyaWJlKGRhdGUgPT4gdGhpcy5uYXZpZ2F0ZS5lbWl0KGRhdGUpKTtcbiAgICBkYXRlcGlja2VySW5zdGFuY2Uuc2VsZWN0LnN1YnNjcmliZShkYXRlID0+IHtcbiAgICAgIHRoaXMuZGF0ZVNlbGVjdC5lbWl0KGRhdGUpO1xuICAgICAgaWYgKHRoaXMuYXV0b0Nsb3NlID09PSB0cnVlIHx8IHRoaXMuYXV0b0Nsb3NlID09PSAnaW5zaWRlJykge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93cml0ZU1vZGVsVmFsdWUobW9kZWw6IE5nYkRhdGUpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX3BhcnNlckZvcm1hdHRlci5mb3JtYXQobW9kZWwpO1xuICAgIHRoaXMuX2lucHV0VmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCB2YWx1ZSk7XG4gICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHRoaXMuX2NSZWYuaW5zdGFuY2Uud3JpdGVWYWx1ZSh0aGlzLl9kYXRlQWRhcHRlci50b01vZGVsKG1vZGVsKSk7XG4gICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9mcm9tRGF0ZVN0cnVjdChkYXRlOiBOZ2JEYXRlU3RydWN0KTogTmdiRGF0ZSB7XG4gICAgY29uc3QgbmdiRGF0ZSA9IGRhdGUgPyBuZXcgTmdiRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGgsIGRhdGUuZGF5KSA6IG51bGw7XG4gICAgcmV0dXJuIHRoaXMuX2NhbGVuZGFyLmlzVmFsaWQobmdiRGF0ZSkgPyBuZ2JEYXRlIDogbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbnB1dCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuL25nYi1kYXRlJztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlckkxOG59IGZyb20gJy4vZGF0ZXBpY2tlci1pMThuJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW25nYkRhdGVwaWNrZXJEYXlWaWV3XScsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzdHlsZVVybHM6IFsnLi9kYXRlcGlja2VyLWRheS12aWV3LnNjc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdidG4tbGlnaHQnLFxuICAgICdbY2xhc3MuYmctcHJpbWFyeV0nOiAnc2VsZWN0ZWQnLFxuICAgICdbY2xhc3MudGV4dC13aGl0ZV0nOiAnc2VsZWN0ZWQnLFxuICAgICdbY2xhc3MudGV4dC1tdXRlZF0nOiAnaXNNdXRlZCgpJyxcbiAgICAnW2NsYXNzLm91dHNpZGVdJzogJ2lzTXV0ZWQoKScsXG4gICAgJ1tjbGFzcy5hY3RpdmVdJzogJ2ZvY3VzZWQnXG4gIH0sXG4gIHRlbXBsYXRlOiBge3sgaTE4bi5nZXREYXlOdW1lcmFscyhkYXRlKSB9fWBcbn0pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlckRheVZpZXcge1xuICBASW5wdXQoKSBjdXJyZW50TW9udGg6IG51bWJlcjtcbiAgQElucHV0KCkgZGF0ZTogTmdiRGF0ZTtcbiAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGZvY3VzZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHNlbGVjdGVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpMThuOiBOZ2JEYXRlcGlja2VySTE4bikge31cblxuICBpc011dGVkKCkgeyByZXR1cm4gIXRoaXMuc2VsZWN0ZWQgJiYgKHRoaXMuZGF0ZS5tb250aCAhPT0gdGhpcy5jdXJyZW50TW9udGggfHwgdGhpcy5kaXNhYmxlZCk7IH1cbn1cbiIsImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nYkRhdGV9IGZyb20gJy4vbmdiLWRhdGUnO1xuaW1wb3J0IHt0b0ludGVnZXJ9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJJMThufSBmcm9tICcuL2RhdGVwaWNrZXItaTE4bic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1kYXRlcGlja2VyLW5hdmlnYXRpb24tc2VsZWN0JyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHN0eWxlVXJsczogWycuL2RhdGVwaWNrZXItbmF2aWdhdGlvbi1zZWxlY3Quc2NzcyddLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxzZWxlY3RcbiAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICBjbGFzcz1cImN1c3RvbS1zZWxlY3RcIlxuICAgICAgW3ZhbHVlXT1cImRhdGU/Lm1vbnRoXCJcbiAgICAgIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLmRhdGVwaWNrZXIuc2VsZWN0LW1vbnRoXCIgYXJpYS1sYWJlbD1cIlNlbGVjdCBtb250aFwiXG4gICAgICBpMThuLXRpdGxlPVwiQEBuZ2IuZGF0ZXBpY2tlci5zZWxlY3QtbW9udGhcIiB0aXRsZT1cIlNlbGVjdCBtb250aFwiXG4gICAgICAoY2hhbmdlKT1cImNoYW5nZU1vbnRoKCRldmVudC50YXJnZXQudmFsdWUpXCI+XG4gICAgICAgIDxvcHRpb24gKm5nRm9yPVwibGV0IG0gb2YgbW9udGhzXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJpMThuLmdldE1vbnRoRnVsbE5hbWUobSwgZGF0ZT8ueWVhcilcIlxuICAgICAgICAgICAgICAgIFt2YWx1ZV09XCJtXCI+e3sgaTE4bi5nZXRNb250aFNob3J0TmFtZShtLCBkYXRlPy55ZWFyKSB9fTwvb3B0aW9uPlxuICAgIDwvc2VsZWN0PjxzZWxlY3RcbiAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICBjbGFzcz1cImN1c3RvbS1zZWxlY3RcIlxuICAgICAgW3ZhbHVlXT1cImRhdGU/LnllYXJcIlxuICAgICAgaTE4bi1hcmlhLWxhYmVsPVwiQEBuZ2IuZGF0ZXBpY2tlci5zZWxlY3QteWVhclwiIGFyaWEtbGFiZWw9XCJTZWxlY3QgeWVhclwiXG4gICAgICBpMThuLXRpdGxlPVwiQEBuZ2IuZGF0ZXBpY2tlci5zZWxlY3QteWVhclwiIHRpdGxlPVwiU2VsZWN0IHllYXJcIlxuICAgICAgKGNoYW5nZSk9XCJjaGFuZ2VZZWFyKCRldmVudC50YXJnZXQudmFsdWUpXCI+XG4gICAgICAgIDxvcHRpb24gKm5nRm9yPVwibGV0IHkgb2YgeWVhcnNcIiBbdmFsdWVdPVwieVwiPnt7IGkxOG4uZ2V0WWVhck51bWVyYWxzKHkpIH19PC9vcHRpb24+XG4gICAgPC9zZWxlY3Q+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlck5hdmlnYXRpb25TZWxlY3Qge1xuICBASW5wdXQoKSBkYXRlOiBOZ2JEYXRlO1xuICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcbiAgQElucHV0KCkgbW9udGhzOiBudW1iZXJbXTtcbiAgQElucHV0KCkgeWVhcnM6IG51bWJlcltdO1xuXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYkRhdGU+KCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGkxOG46IE5nYkRhdGVwaWNrZXJJMThuKSB7fVxuXG4gIGNoYW5nZU1vbnRoKG1vbnRoOiBzdHJpbmcpIHsgdGhpcy5zZWxlY3QuZW1pdChuZXcgTmdiRGF0ZSh0aGlzLmRhdGUueWVhciwgdG9JbnRlZ2VyKG1vbnRoKSwgMSkpOyB9XG5cbiAgY2hhbmdlWWVhcih5ZWFyOiBzdHJpbmcpIHsgdGhpcy5zZWxlY3QuZW1pdChuZXcgTmdiRGF0ZSh0b0ludGVnZXIoeWVhciksIHRoaXMuZGF0ZS5tb250aCwgMSkpOyB9XG59XG4iLCJpbXBvcnQge05nYkRhdGV9IGZyb20gJy4uL25nYi1kYXRlJztcbmltcG9ydCB7TmdiUGVyaW9kLCBOZ2JDYWxlbmRhcn0gZnJvbSAnLi4vbmdiLWNhbGVuZGFyJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzTnVtYmVyfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTmdiQ2FsZW5kYXJIaWpyaSBleHRlbmRzIE5nYkNhbGVuZGFyIHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBkYXlzIGluIGEgc3BlY2lmaWMgSGlqcmkgbW9udGguXG4gICAqIGBtb250aGAgaXMgMSBmb3IgTXVoYXJyYW0sIDIgZm9yIFNhZmFyLCBldGMuXG4gICAqIGB5ZWFyYCBpcyBhbnkgSGlqcmkgeWVhci5cbiAgICovXG4gIGFic3RyYWN0IGdldERheXNQZXJNb250aChtb250aDogbnVtYmVyLCB5ZWFyOiBudW1iZXIpOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGVxdWl2YWxlbnQgSGlqcmkgZGF0ZSB2YWx1ZSBmb3IgYSBnaXZlIGlucHV0IEdyZWdvcmlhbiBkYXRlLlxuICAgKiBgZ0RhdGVgIGlzIHMgSlMgRGF0ZSB0byBiZSBjb252ZXJ0ZWQgdG8gSGlqcmkuXG4gICAqL1xuICBhYnN0cmFjdCBmcm9tR3JlZ29yaWFuKGdEYXRlOiBEYXRlKTogTmdiRGF0ZTtcblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIGN1cnJlbnQgSGlqcmkgZGF0ZSB0byBHcmVnb3JpYW4uXG4gICAqL1xuICBhYnN0cmFjdCB0b0dyZWdvcmlhbihoRGF0ZTogTmdiRGF0ZSk6IERhdGU7XG5cbiAgZ2V0RGF5c1BlcldlZWsoKSB7IHJldHVybiA3OyB9XG5cbiAgZ2V0TW9udGhzKCkgeyByZXR1cm4gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTJdOyB9XG5cbiAgZ2V0V2Vla3NQZXJNb250aCgpIHsgcmV0dXJuIDY7IH1cblxuICBnZXROZXh0KGRhdGU6IE5nYkRhdGUsIHBlcmlvZDogTmdiUGVyaW9kID0gJ2QnLCBudW1iZXIgPSAxKSB7XG4gICAgZGF0ZSA9IG5ldyBOZ2JEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCwgZGF0ZS5kYXkpO1xuXG4gICAgc3dpdGNoIChwZXJpb2QpIHtcbiAgICAgIGNhc2UgJ3knOlxuICAgICAgICBkYXRlID0gdGhpcy5fc2V0WWVhcihkYXRlLCBkYXRlLnllYXIgKyBudW1iZXIpO1xuICAgICAgICBkYXRlLm1vbnRoID0gMTtcbiAgICAgICAgZGF0ZS5kYXkgPSAxO1xuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgIGNhc2UgJ20nOlxuICAgICAgICBkYXRlID0gdGhpcy5fc2V0TW9udGgoZGF0ZSwgZGF0ZS5tb250aCArIG51bWJlcik7XG4gICAgICAgIGRhdGUuZGF5ID0gMTtcbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICBjYXNlICdkJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NldERheShkYXRlLCBkYXRlLmRheSArIG51bWJlcik7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gIH1cblxuICBnZXRQcmV2KGRhdGU6IE5nYkRhdGUsIHBlcmlvZDogTmdiUGVyaW9kID0gJ2QnLCBudW1iZXIgPSAxKSB7IHJldHVybiB0aGlzLmdldE5leHQoZGF0ZSwgcGVyaW9kLCAtbnVtYmVyKTsgfVxuXG4gIGdldFdlZWtkYXkoZGF0ZTogTmdiRGF0ZSkge1xuICAgIGNvbnN0IGRheSA9IHRoaXMudG9HcmVnb3JpYW4oZGF0ZSkuZ2V0RGF5KCk7XG4gICAgLy8gaW4gSlMgRGF0ZSBTdW49MCwgaW4gSVNPIDg2MDEgU3VuPTdcbiAgICByZXR1cm4gZGF5ID09PSAwID8gNyA6IGRheTtcbiAgfVxuXG4gIGdldFdlZWtOdW1iZXIod2VlazogTmdiRGF0ZVtdLCBmaXJzdERheU9mV2VlazogbnVtYmVyKSB7XG4gICAgLy8gaW4gSlMgRGF0ZSBTdW49MCwgaW4gSVNPIDg2MDEgU3VuPTdcbiAgICBpZiAoZmlyc3REYXlPZldlZWsgPT09IDcpIHtcbiAgICAgIGZpcnN0RGF5T2ZXZWVrID0gMDtcbiAgICB9XG5cbiAgICBjb25zdCB0aHVyc2RheUluZGV4ID0gKDQgKyA3IC0gZmlyc3REYXlPZldlZWspICUgNztcbiAgICBjb25zdCBkYXRlID0gd2Vla1t0aHVyc2RheUluZGV4XTtcblxuICAgIGNvbnN0IGpzRGF0ZSA9IHRoaXMudG9HcmVnb3JpYW4oZGF0ZSk7XG4gICAganNEYXRlLnNldERhdGUoanNEYXRlLmdldERhdGUoKSArIDQgLSAoanNEYXRlLmdldERheSgpIHx8IDcpKTsgIC8vIFRodXJzZGF5XG4gICAgY29uc3QgdGltZSA9IGpzRGF0ZS5nZXRUaW1lKCk7XG4gICAgY29uc3QgTXVoRGF0ZSA9IHRoaXMudG9HcmVnb3JpYW4obmV3IE5nYkRhdGUoZGF0ZS55ZWFyLCAxLCAxKSk7ICAvLyBDb21wYXJlIHdpdGggTXVoYXJyYW0gMVxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucm91bmQoKHRpbWUgLSBNdWhEYXRlLmdldFRpbWUoKSkgLyA4NjQwMDAwMCkgLyA3KSArIDE7XG4gIH1cblxuICBnZXRUb2RheSgpOiBOZ2JEYXRlIHsgcmV0dXJuIHRoaXMuZnJvbUdyZWdvcmlhbihuZXcgRGF0ZSgpKTsgfVxuXG5cbiAgaXNWYWxpZChkYXRlOiBOZ2JEYXRlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRhdGUgJiYgaXNOdW1iZXIoZGF0ZS55ZWFyKSAmJiBpc051bWJlcihkYXRlLm1vbnRoKSAmJiBpc051bWJlcihkYXRlLmRheSkgJiZcbiAgICAgICAgIWlzTmFOKHRoaXMudG9HcmVnb3JpYW4oZGF0ZSkuZ2V0VGltZSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldERheShkYXRlOiBOZ2JEYXRlLCBkYXk6IG51bWJlcik6IE5nYkRhdGUge1xuICAgIGRheSA9ICtkYXk7XG4gICAgbGV0IG1EYXlzID0gdGhpcy5nZXREYXlzUGVyTW9udGgoZGF0ZS5tb250aCwgZGF0ZS55ZWFyKTtcbiAgICBpZiAoZGF5IDw9IDApIHtcbiAgICAgIHdoaWxlIChkYXkgPD0gMCkge1xuICAgICAgICBkYXRlID0gdGhpcy5fc2V0TW9udGgoZGF0ZSwgZGF0ZS5tb250aCAtIDEpO1xuICAgICAgICBtRGF5cyA9IHRoaXMuZ2V0RGF5c1Blck1vbnRoKGRhdGUubW9udGgsIGRhdGUueWVhcik7XG4gICAgICAgIGRheSArPSBtRGF5cztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRheSA+IG1EYXlzKSB7XG4gICAgICB3aGlsZSAoZGF5ID4gbURheXMpIHtcbiAgICAgICAgZGF5IC09IG1EYXlzO1xuICAgICAgICBkYXRlID0gdGhpcy5fc2V0TW9udGgoZGF0ZSwgZGF0ZS5tb250aCArIDEpO1xuICAgICAgICBtRGF5cyA9IHRoaXMuZ2V0RGF5c1Blck1vbnRoKGRhdGUubW9udGgsIGRhdGUueWVhcik7XG4gICAgICB9XG4gICAgfVxuICAgIGRhdGUuZGF5ID0gZGF5O1xuICAgIHJldHVybiBkYXRlO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0TW9udGgoZGF0ZTogTmdiRGF0ZSwgbW9udGg6IG51bWJlcik6IE5nYkRhdGUge1xuICAgIG1vbnRoID0gK21vbnRoO1xuICAgIGRhdGUueWVhciA9IGRhdGUueWVhciArIE1hdGguZmxvb3IoKG1vbnRoIC0gMSkgLyAxMik7XG4gICAgZGF0ZS5tb250aCA9IE1hdGguZmxvb3IoKChtb250aCAtIDEpICUgMTIgKyAxMikgJSAxMikgKyAxO1xuICAgIHJldHVybiBkYXRlO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0WWVhcihkYXRlOiBOZ2JEYXRlLCB5ZWFyOiBudW1iZXIpOiBOZ2JEYXRlIHtcbiAgICBkYXRlLnllYXIgPSAreWVhcjtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHtOZ2JDYWxlbmRhckhpanJpfSBmcm9tICcuL25nYi1jYWxlbmRhci1oaWpyaSc7XG5pbXBvcnQge05nYkRhdGV9IGZyb20gJy4uL25nYi1kYXRlJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGlzbGFtaWMgeWVhciBpcyBhIGxlYXAgeWVhclxuICovXG5mdW5jdGlvbiBpc0lzbGFtaWNMZWFwWWVhcihoWWVhcjogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiAoMTQgKyAxMSAqIGhZZWFyKSAlIDMwIDwgMTE7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGdyZWdvcmlhbiB5ZWFycyBpcyBhIGxlYXAgeWVhclxuICovXG5mdW5jdGlvbiBpc0dyZWdvcmlhbkxlYXBZZWFyKGdEYXRlOiBEYXRlKTogYm9vbGVhbiB7XG4gIGNvbnN0IHllYXIgPSBnRGF0ZS5nZXRGdWxsWWVhcigpO1xuICByZXR1cm4geWVhciAlIDQgPT09IDAgJiYgeWVhciAlIDEwMCAhPT0gMCB8fCB5ZWFyICUgNDAwID09PSAwO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHN0YXJ0IG9mIEhpanJpIE1vbnRoLlxuICogYGhNb250aGAgaXMgMCBmb3IgTXVoYXJyYW0sIDEgZm9yIFNhZmFyLCBldGMuXG4gKiBgaFllYXJgIGlzIGFueSBIaWpyaSBoWWVhci5cbiAqL1xuZnVuY3Rpb24gZ2V0SXNsYW1pY01vbnRoU3RhcnQoaFllYXI6IG51bWJlciwgaE1vbnRoOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5jZWlsKDI5LjUgKiBoTW9udGgpICsgKGhZZWFyIC0gMSkgKiAzNTQgKyBNYXRoLmZsb29yKCgzICsgMTEgKiBoWWVhcikgLyAzMC4wKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzdGFydCBvZiBIaWpyaSB5ZWFyLlxuICogYHllYXJgIGlzIGFueSBIaWpyaSB5ZWFyLlxuICovXG5mdW5jdGlvbiBnZXRJc2xhbWljWWVhclN0YXJ0KHllYXI6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiAoeWVhciAtIDEpICogMzU0ICsgTWF0aC5mbG9vcigoMyArIDExICogeWVhcikgLyAzMC4wKTtcbn1cblxuZnVuY3Rpb24gbW9kKGE6IG51bWJlciwgYjogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIGEgLSBiICogTWF0aC5mbG9vcihhIC8gYik7XG59XG5cbi8qKlxuICogVGhlIGNpdmlsIGNhbGVuZGFyIGlzIG9uZSB0eXBlIG9mIEhpanJpIGNhbGVuZGFycyB1c2VkIGluIGlzbGFtaWMgY291bnRyaWVzLlxuICogVXNlcyBhIGZpeGVkIGN5Y2xlIG9mIGFsdGVybmF0aW5nIDI5LSBhbmQgMzAtZGF5IG1vbnRocyxcbiAqIHdpdGggYSBsZWFwIGRheSBhZGRlZCB0byB0aGUgbGFzdCBtb250aCBvZiAxMSBvdXQgb2YgZXZlcnkgMzAgeWVhcnMuXG4gKiBodHRwOi8vY2xkci51bmljb2RlLm9yZy9kZXZlbG9wbWVudC9kZXZlbG9wbWVudC1wcm9jZXNzL2Rlc2lnbi1wcm9wb3NhbHMvaXNsYW1pYy1jYWxlbmRhci10eXBlc1xuICogQWxsIHRoZSBjYWxjdWxhdGlvbnMgaGVyZSBhcmUgYmFzZWQgb24gdGhlIGVxdWF0aW9ucyBmcm9tIFwiQ2FsZW5kcmljYWwgQ2FsY3VsYXRpb25zXCIgQnkgRWR3YXJkIE0uIFJlaW5nb2xkLCBOYWNodW1cbiAqIERlcnNob3dpdHouXG4gKi9cblxuY29uc3QgR1JFR09SSUFOX0VQT0NIID0gMTcyMTQyNS41O1xuY29uc3QgSVNMQU1JQ19FUE9DSCA9IDE5NDg0MzkuNTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5nYkNhbGVuZGFySXNsYW1pY0NpdmlsIGV4dGVuZHMgTmdiQ2FsZW5kYXJIaWpyaSB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBlcXVpdmFsZW50IGlzbGFtaWMoY2l2aWwpIGRhdGUgdmFsdWUgZm9yIGEgZ2l2ZSBpbnB1dCBHcmVnb3JpYW4gZGF0ZS5cbiAgICogYGdEYXRlYCBpcyBhIEpTIERhdGUgdG8gYmUgY29udmVydGVkIHRvIEhpanJpLlxuICAgKi9cbiAgZnJvbUdyZWdvcmlhbihnRGF0ZTogRGF0ZSk6IE5nYkRhdGUge1xuICAgIGNvbnN0IGdZZWFyID0gZ0RhdGUuZ2V0RnVsbFllYXIoKSwgZ01vbnRoID0gZ0RhdGUuZ2V0TW9udGgoKSwgZ0RheSA9IGdEYXRlLmdldERhdGUoKTtcblxuICAgIGxldCBqdWxpYW5EYXkgPSBHUkVHT1JJQU5fRVBPQ0ggLSAxICsgMzY1ICogKGdZZWFyIC0gMSkgKyBNYXRoLmZsb29yKChnWWVhciAtIDEpIC8gNCkgK1xuICAgICAgICAtTWF0aC5mbG9vcigoZ1llYXIgLSAxKSAvIDEwMCkgKyBNYXRoLmZsb29yKChnWWVhciAtIDEpIC8gNDAwKSArXG4gICAgICAgIE1hdGguZmxvb3IoXG4gICAgICAgICAgICAoMzY3ICogKGdNb250aCArIDEpIC0gMzYyKSAvIDEyICsgKGdNb250aCArIDEgPD0gMiA/IDAgOiBpc0dyZWdvcmlhbkxlYXBZZWFyKGdEYXRlKSA/IC0xIDogLTIpICsgZ0RheSk7XG4gICAganVsaWFuRGF5ID0gTWF0aC5mbG9vcihqdWxpYW5EYXkpICsgMC41O1xuXG4gICAgY29uc3QgZGF5cyA9IGp1bGlhbkRheSAtIElTTEFNSUNfRVBPQ0g7XG4gICAgY29uc3QgaFllYXIgPSBNYXRoLmZsb29yKCgzMCAqIGRheXMgKyAxMDY0NikgLyAxMDYzMS4wKTtcbiAgICBsZXQgaE1vbnRoID0gTWF0aC5jZWlsKChkYXlzIC0gMjkgLSBnZXRJc2xhbWljWWVhclN0YXJ0KGhZZWFyKSkgLyAyOS41KTtcbiAgICBoTW9udGggPSBNYXRoLm1pbihoTW9udGgsIDExKTtcbiAgICBjb25zdCBoRGF5ID0gTWF0aC5jZWlsKGRheXMgLSBnZXRJc2xhbWljTW9udGhTdGFydChoWWVhciwgaE1vbnRoKSkgKyAxO1xuICAgIHJldHVybiBuZXcgTmdiRGF0ZShoWWVhciwgaE1vbnRoICsgMSwgaERheSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZXF1aXZhbGVudCBKUyBkYXRlIHZhbHVlIGZvciBhIGdpdmUgaW5wdXQgaXNsYW1pYyhjaXZpbCkgZGF0ZS5cbiAgICogYGhEYXRlYCBpcyBhbiBpc2xhbWljKGNpdmlsKSBkYXRlIHRvIGJlIGNvbnZlcnRlZCB0byBHcmVnb3JpYW4uXG4gICAqL1xuICB0b0dyZWdvcmlhbihoRGF0ZTogTmdiRGF0ZSk6IERhdGUge1xuICAgIGNvbnN0IGhZZWFyID0gaERhdGUueWVhcjtcbiAgICBjb25zdCBoTW9udGggPSBoRGF0ZS5tb250aCAtIDE7XG4gICAgY29uc3QgaERheSA9IGhEYXRlLmRheTtcbiAgICBjb25zdCBqdWxpYW5EYXkgPVxuICAgICAgICBoRGF5ICsgTWF0aC5jZWlsKDI5LjUgKiBoTW9udGgpICsgKGhZZWFyIC0gMSkgKiAzNTQgKyBNYXRoLmZsb29yKCgzICsgMTEgKiBoWWVhcikgLyAzMCkgKyBJU0xBTUlDX0VQT0NIIC0gMTtcblxuICAgIGNvbnN0IHdqZCA9IE1hdGguZmxvb3IoanVsaWFuRGF5IC0gMC41KSArIDAuNSwgZGVwb2NoID0gd2pkIC0gR1JFR09SSUFOX0VQT0NILFxuICAgICAgICAgIHF1YWRyaWNlbnQgPSBNYXRoLmZsb29yKGRlcG9jaCAvIDE0NjA5NyksIGRxYyA9IG1vZChkZXBvY2gsIDE0NjA5NyksIGNlbnQgPSBNYXRoLmZsb29yKGRxYyAvIDM2NTI0KSxcbiAgICAgICAgICBkY2VudCA9IG1vZChkcWMsIDM2NTI0KSwgcXVhZCA9IE1hdGguZmxvb3IoZGNlbnQgLyAxNDYxKSwgZHF1YWQgPSBtb2QoZGNlbnQsIDE0NjEpLFxuICAgICAgICAgIHlpbmRleCA9IE1hdGguZmxvb3IoZHF1YWQgLyAzNjUpO1xuICAgIGxldCB5ZWFyID0gcXVhZHJpY2VudCAqIDQwMCArIGNlbnQgKiAxMDAgKyBxdWFkICogNCArIHlpbmRleDtcbiAgICBpZiAoIShjZW50ID09PSA0IHx8IHlpbmRleCA9PT0gNCkpIHtcbiAgICAgIHllYXIrKztcbiAgICB9XG5cbiAgICBjb25zdCBnWWVhclN0YXJ0ID0gR1JFR09SSUFOX0VQT0NIICsgMzY1ICogKHllYXIgLSAxKSArIE1hdGguZmxvb3IoKHllYXIgLSAxKSAvIDQpIC0gTWF0aC5mbG9vcigoeWVhciAtIDEpIC8gMTAwKSArXG4gICAgICAgIE1hdGguZmxvb3IoKHllYXIgLSAxKSAvIDQwMCk7XG5cbiAgICBjb25zdCB5ZWFyZGF5ID0gd2pkIC0gZ1llYXJTdGFydDtcblxuICAgIGNvbnN0IHRqZCA9IEdSRUdPUklBTl9FUE9DSCAtIDEgKyAzNjUgKiAoeWVhciAtIDEpICsgTWF0aC5mbG9vcigoeWVhciAtIDEpIC8gNCkgLSBNYXRoLmZsb29yKCh5ZWFyIC0gMSkgLyAxMDApICtcbiAgICAgICAgTWF0aC5mbG9vcigoeWVhciAtIDEpIC8gNDAwKSArIE1hdGguZmxvb3IoNzM5IC8gMTIgKyAoaXNHcmVnb3JpYW5MZWFwWWVhcihuZXcgRGF0ZSh5ZWFyLCAzLCAxKSkgPyAtMSA6IC0yKSArIDEpO1xuXG4gICAgY29uc3QgbGVhcGFkaiA9IHdqZCA8IHRqZCA/IDAgOiBpc0dyZWdvcmlhbkxlYXBZZWFyKG5ldyBEYXRlKHllYXIsIDMsIDEpKSA/IDEgOiAyO1xuXG4gICAgY29uc3QgbW9udGggPSBNYXRoLmZsb29yKCgoeWVhcmRheSArIGxlYXBhZGopICogMTIgKyAzNzMpIC8gMzY3KTtcbiAgICBjb25zdCB0amQyID0gR1JFR09SSUFOX0VQT0NIIC0gMSArIDM2NSAqICh5ZWFyIC0gMSkgKyBNYXRoLmZsb29yKCh5ZWFyIC0gMSkgLyA0KSAtIE1hdGguZmxvb3IoKHllYXIgLSAxKSAvIDEwMCkgK1xuICAgICAgICBNYXRoLmZsb29yKCh5ZWFyIC0gMSkgLyA0MDApICtcbiAgICAgICAgTWF0aC5mbG9vcihcbiAgICAgICAgICAgICgzNjcgKiBtb250aCAtIDM2MikgLyAxMiArIChtb250aCA8PSAyID8gMCA6IGlzR3JlZ29yaWFuTGVhcFllYXIobmV3IERhdGUoeWVhciwgbW9udGggLSAxLCAxKSkgPyAtMSA6IC0yKSArXG4gICAgICAgICAgICAxKTtcblxuICAgIGNvbnN0IGRheSA9IHdqZCAtIHRqZDIgKyAxO1xuXG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZGF5cyBpbiBhIHNwZWNpZmljIEhpanJpIG1vbnRoLlxuICAgKiBgbW9udGhgIGlzIDEgZm9yIE11aGFycmFtLCAyIGZvciBTYWZhciwgZXRjLlxuICAgKiBgeWVhcmAgaXMgYW55IEhpanJpIHllYXIuXG4gICAqL1xuICBnZXREYXlzUGVyTW9udGgobW9udGg6IG51bWJlciwgeWVhcjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICB5ZWFyID0geWVhciArIE1hdGguZmxvb3IobW9udGggLyAxMyk7XG4gICAgbW9udGggPSAoKG1vbnRoIC0gMSkgJSAxMikgKyAxO1xuICAgIGxldCBsZW5ndGggPSAyOSArIG1vbnRoICUgMjtcbiAgICBpZiAobW9udGggPT09IDEyICYmIGlzSXNsYW1pY0xlYXBZZWFyKHllYXIpKSB7XG4gICAgICBsZW5ndGgrKztcbiAgICB9XG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgfVxufVxuIiwiaW1wb3J0IHtOZ2JDYWxlbmRhcklzbGFtaWNDaXZpbH0gZnJvbSAnLi9uZ2ItY2FsZW5kYXItaXNsYW1pYy1jaXZpbCc7XG5pbXBvcnQge05nYkRhdGV9IGZyb20gJy4uL25nYi1kYXRlJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogVW1hbHF1cmEgY2FsZW5kYXIgaXMgb25lIHR5cGUgb2YgSGlqcmkgY2FsZW5kYXJzIHVzZWQgaW4gaXNsYW1pYyBjb3VudHJpZXMuXG4gKiBUaGlzIENhbGVuZGFyIGlzIHVzZWQgYnkgU2F1ZGkgQXJhYmlhIGZvciBhZG1pbmlzdHJhdGl2ZSBwdXJwb3NlLlxuICogVW5saWtlIHRhYnVsYXIgY2FsZW5kYXJzLCB0aGUgYWxnb3JpdGhtIGludm9sdmVzIGFzdHJvbm9taWNhbCBjYWxjdWxhdGlvbiwgYnV0IGl0J3Mgc3RpbGwgZGV0ZXJtaW5pc3RpYy5cbiAqIGh0dHA6Ly9jbGRyLnVuaWNvZGUub3JnL2RldmVsb3BtZW50L2RldmVsb3BtZW50LXByb2Nlc3MvZGVzaWduLXByb3Bvc2Fscy9pc2xhbWljLWNhbGVuZGFyLXR5cGVzXG4gKi9cblxuY29uc3QgR1JFR09SSUFOX0ZJUlNUX0RBVEUgPSBuZXcgRGF0ZSgxODgyLCAxMCwgMTIpO1xuY29uc3QgR1JFR09SSUFOX0xBU1RfREFURSA9IG5ldyBEYXRlKDIxNzQsIDEwLCAyNSk7XG5jb25zdCBISUpSSV9CRUdJTiA9IDEzMDA7XG5jb25zdCBISUpSSV9FTkQgPSAxNjAwO1xuY29uc3QgT05FX0RBWSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG5cbmNvbnN0IE1PTlRIX0xFTkdUSCA9IFtcbiAgLy8gMTMwMC0xMzA0XG4gICcxMDEwMTAxMDEwMTAnLCAnMTEwMTAxMDEwMTAwJywgJzExMTAxMTAwMTAwMScsICcwMTEwMTEwMTAxMDAnLCAnMDExMDExMTAxMDEwJyxcbiAgLy8gMTMwNS0xMzA5XG4gICcwMDExMDExMDExMDAnLCAnMTAxMDEwMTAxMTAxJywgJzAxMDEwMTAxMDEwMScsICcwMTEwMTAxMDEwMDEnLCAnMDExMTEwMDEwMDEwJyxcbiAgLy8gMTMxMC0xMzE0XG4gICcxMDExMTAxMDEwMDEnLCAnMDEwMTExMDEwMTAwJywgJzEwMTAxMTAxMTAxMCcsICcwMTAxMDEwMTExMDAnLCAnMTEwMTAwMTAxMTAxJyxcbiAgLy8gMTMxNS0xMzE5XG4gICcwMTEwMTAwMTAxMDEnLCAnMDExMTAxMDAxMDEwJywgJzEwMTEwMTAxMDEwMCcsICcxMDExMDExMDEwMTAnLCAnMDEwMTEwMTAxMTAxJyxcbiAgLy8gMTMyMC0xMzI0XG4gICcwMTAwMTAxMDExMTAnLCAnMTAxMDAxMDAxMTExJywgJzAxMDEwMDAxMDExMScsICcwMTEwMTAwMDEwMTEnLCAnMDExMDEwMTAwMTAxJyxcbiAgLy8gMTMyNS0xMzI5XG4gICcxMDEwMTEwMTAxMDEnLCAnMDAxMDExMDEwMTEwJywgJzEwMDEwMTAxMTAxMScsICcwMTAwMTAwMTExMDEnLCAnMTAxMDAxMDAxMTAxJyxcbiAgLy8gMTMzMC0xMzM0XG4gICcxMTAxMDAxMDAxMTAnLCAnMTEwMTEwMDEwMTAxJywgJzAxMDExMDEwMTEwMCcsICcxMDAxMTAxMTAxMTAnLCAnMDAxMDEwMTExMDEwJyxcbiAgLy8gMTMzNS0xMzM5XG4gICcxMDEwMDEwMTEwMTEnLCAnMDEwMTAwMTAxMDExJywgJzEwMTAxMDAxMDEwMScsICcwMTEwMTEwMDEwMTAnLCAnMTAxMDExMTAxMDAxJyxcbiAgLy8gMTM0MC0xMzQ0XG4gICcwMDEwMTExMTAxMDAnLCAnMTAwMTAxMTEwMTEwJywgJzAwMTAxMDExMDExMCcsICcxMDAxMDEwMTAxMTAnLCAnMTAxMDExMDAxMDEwJyxcbiAgLy8gMTM0NS0xMzQ5XG4gICcxMDExMTAxMDAxMDAnLCAnMTAxMTExMDEwMDEwJywgJzAxMDExMTAxMTAwMScsICcwMDEwMTEwMTExMDAnLCAnMTAwMTAxMTAxMTAxJyxcbiAgLy8gMTM1MC0xMzU0XG4gICcwMTAxMDEwMDExMDEnLCAnMTAxMDEwMTAwMTAxJywgJzEwMTEwMTAxMDAxMCcsICcxMDExMTAxMDAxMDEnLCAnMDEwMTEwMTEwMTAwJyxcbiAgLy8gMTM1NS0xMzU5XG4gICcxMDAxMTAxMTAxMTAnLCAnMDEwMTAxMDEwMTExJywgJzAwMTAxMDAxMDExMScsICcwMTAxMDEwMDEwMTEnLCAnMDExMDEwMTAwMDExJyxcbiAgLy8gMTM2MC0xMzY0XG4gICcwMTExMDEwMTAwMTAnLCAnMTAxMTAxMTAwMTAxJywgJzAxMDEwMTEwMTAxMCcsICcxMDEwMTAxMDEwMTEnLCAnMDEwMTAwMTAxMDExJyxcbiAgLy8gMTM2NS0xMzY5XG4gICcxMTAwMTAwMTAxMDEnLCAnMTEwMTAxMDAxMDEwJywgJzExMDExMDEwMDEwMScsICcwMTAxMTEwMDEwMTAnLCAnMTAxMDExMDEwMTEwJyxcbiAgLy8gMTM3MC0xMzc0XG4gICcxMDAxMDEwMTAxMTEnLCAnMDEwMDEwMTAxMDExJywgJzEwMDEwMTAwMTAxMScsICcxMDEwMTAxMDAxMDEnLCAnMTAxMTAxMDEwMDEwJyxcbiAgLy8gMTM3NS0xMzc5XG4gICcxMDExMDExMDEwMTAnLCAnMDEwMTAxMTEwMTAxJywgJzAwMTAwMTExMDExMCcsICcxMDAwMTAxMTAxMTEnLCAnMDEwMDAxMDExMDExJyxcbiAgLy8gMTM4MC0xMzg0XG4gICcwMTAxMDEwMTAxMDEnLCAnMDEwMTEwMTAxMDAxJywgJzAxMDExMDExMDEwMCcsICcxMDAxMTEwMTEwMTAnLCAnMDEwMDExMDExMTAxJyxcbiAgLy8gMTM4NS0xMzg5XG4gICcwMDEwMDExMDExMTAnLCAnMTAwMTAwMTEwMTEwJywgJzEwMTAxMDEwMTAxMCcsICcxMTAxMDEwMTAxMDAnLCAnMTEwMTEwMTEwMDEwJyxcbiAgLy8gMTM5MC0xMzk0XG4gICcwMTAxMTEwMTAxMDEnLCAnMDAxMDExMDExMDEwJywgJzEwMDEwMTAxMTAxMScsICcwMTAwMTAxMDEwMTEnLCAnMTAxMDAxMDEwMTAxJyxcbiAgLy8gMTM5NS0xMzk5XG4gICcxMDExMDEwMDEwMDEnLCAnMTAxMTAxMTAwMTAwJywgJzEwMTEwMTExMDAwMScsICcwMTAxMTAxMTAxMDAnLCAnMTAxMDEwMTEwMTAxJyxcbiAgLy8gMTQwMC0xNDA0XG4gICcxMDEwMDEwMTAxMDEnLCAnMTEwMTAwMTAwMTAxJywgJzExMTAxMDAxMDAxMCcsICcxMTEwMTEwMDEwMDEnLCAnMDExMDExMDEwMTAwJyxcbiAgLy8gMTQwNS0xNDA5XG4gICcxMDEwMTExMDEwMDEnLCAnMTAwMTAxMTAxMDExJywgJzAxMDAxMDEwMTAxMScsICcxMDEwMTAwMTAwMTEnLCAnMTEwMTAxMDAxMDAxJyxcbiAgLy8gMTQxMC0xNDE0XG4gICcxMTAxMTAxMDAxMDAnLCAnMTEwMTEwMTEwMDEwJywgJzEwMTAxMDExMTAwMScsICcwMTAwMTAxMTEwMTAnLCAnMTAxMDAxMDExMDExJyxcbiAgLy8gMTQxNS0xNDE5XG4gICcwMTAxMDAxMDEwMTEnLCAnMTAxMDEwMDEwMTAxJywgJzEwMTEwMDEwMTAxMCcsICcxMDExMDEwMTAxMDEnLCAnMDEwMTAxMDExMTAwJyxcbiAgLy8gMTQyMC0xNDI0XG4gICcwMTAwMTAxMTExMDEnLCAnMDAxMDAwMTExMTAxJywgJzEwMDEwMDAxMTEwMScsICcxMDEwMTAwMTAxMDEnLCAnMTAxMTAxMDAxMDEwJyxcbiAgLy8gMTQyNS0xNDI5XG4gICcxMDExMDEwMTEwMTAnLCAnMDEwMTAxMTAxMTAxJywgJzAwMTAxMDExMDExMCcsICcxMDAxMDAxMTEwMTEnLCAnMDEwMDEwMDExMDExJyxcbiAgLy8gMTQzMC0xNDM0XG4gICcwMTEwMDEwMTAxMDEnLCAnMDExMDEwMTAxMDAxJywgJzAxMTEwMTAxMDEwMCcsICcxMDExMDExMDEwMTAnLCAnMDEwMTAxMTAxMTAwJyxcbiAgLy8gMTQzNS0xNDM5XG4gICcxMDEwMTAxMDExMDEnLCAnMDEwMTAxMDEwMTAxJywgJzEwMTEwMDEwMTAwMScsICcxMDExMTAwMTAwMTAnLCAnMTAxMTEwMTAxMDAxJyxcbiAgLy8gMTQ0MC0xNDQ0XG4gICcwMTAxMTEwMTAxMDAnLCAnMTAxMDExMDExMDEwJywgJzAxMDEwMTAxMTAxMCcsICcxMDEwMTAxMDEwMTEnLCAnMDEwMTEwMDEwMTAxJyxcbiAgLy8gMTQ0NS0xNDQ5XG4gICcwMTExMDEwMDEwMDEnLCAnMDExMTAxMTAwMTAwJywgJzEwMTExMDEwMTAxMCcsICcwMTAxMTAxMTAxMDEnLCAnMDAxMDEwMTEwMTEwJyxcbiAgLy8gMTQ1MC0xNDU0XG4gICcxMDEwMDEwMTAxMTAnLCAnMTExMDAxMDAxMTAxJywgJzEwMTEwMDEwMDEwMScsICcxMDExMDEwMTAwMTAnLCAnMTAxMTAxMTAxMDEwJyxcbiAgLy8gMTQ1NS0xNDU5XG4gICcwMTAxMTAxMDExMDEnLCAnMDAxMDEwMTAxMTEwJywgJzEwMDEwMDEwMTExMScsICcwMTAwMTAwMTAxMTEnLCAnMDExMDAxMDAxMDExJyxcbiAgLy8gMTQ2MC0xNDY0XG4gICcwMTEwMTAxMDAxMDEnLCAnMDExMDEwMTAxMTAwJywgJzEwMTAxMTAxMDExMCcsICcwMTAxMDEwMTExMDEnLCAnMDEwMDEwMDExMTAxJyxcbiAgLy8gMTQ2NS0xNDY5XG4gICcxMDEwMDEwMDExMDEnLCAnMTEwMTAwMDEwMTEwJywgJzExMDExMDAxMDEwMScsICcwMTAxMTAxMDEwMTAnLCAnMDEwMTEwMTEwMTAxJyxcbiAgLy8gMTQ3MC0xNDc0XG4gICcwMDEwMTEwMTEwMTAnLCAnMTAwMTAxMDExMDExJywgJzAxMDAxMDEwMTEwMScsICcwMTAxMTAwMTAxMDEnLCAnMDExMDExMDAxMDEwJyxcbiAgLy8gMTQ3NS0xNDc5XG4gICcwMTEwMTExMDAxMDAnLCAnMTAxMDExMTAxMDEwJywgJzAxMDAxMTExMDEwMScsICcwMDEwMTAxMTAxMTAnLCAnMTAwMTAxMDEwMTEwJyxcbiAgLy8gMTQ4MC0xNDg0XG4gICcxMDEwMTAxMDEwMTAnLCAnMTAxMTAxMDEwMTAwJywgJzEwMTExMTAxMDAxMCcsICcwMTAxMTEwMTEwMDEnLCAnMDAxMDExMTAxMDEwJyxcbiAgLy8gMTQ4NS0xNDg5XG4gICcxMDAxMDExMDExMDEnLCAnMDEwMDEwMTAxMTAxJywgJzEwMTAxMDAxMDEwMScsICcxMDExMDEwMDEwMTAnLCAnMTAxMTEwMTAwMTAxJyxcbiAgLy8gMTQ5MC0xNDk0XG4gICcwMTAxMTAxMTAwMTAnLCAnMTAwMTEwMTEwMTAxJywgJzAxMDAxMTAxMDExMCcsICcxMDEwMTAwMTAxMTEnLCAnMDEwMTAxMDAwMTExJyxcbiAgLy8gMTQ5NS0xNDk5XG4gICcwMTEwMTAwMTAwMTEnLCAnMDExMTAxMDAxMDAxJywgJzEwMTEwMTAxMDEwMScsICcwMTAxMDExMDEwMTAnLCAnMTAxMDAxMTAxMDExJyxcbiAgLy8gMTUwMC0xNTA0XG4gICcwMTAxMDAxMDEwMTEnLCAnMTAxMDEwMDAxMDExJywgJzExMDEwMTAwMDExMCcsICcxMTAxMTAxMDAwMTEnLCAnMDEwMTExMDAxMDEwJyxcbiAgLy8gMTUwNS0xNTA5XG4gICcxMDEwMTEwMTAxMTAnLCAnMDEwMDExMDExMDExJywgJzAwMTAwMTEwMTAxMScsICcxMDAxMDEwMDEwMTEnLCAnMTAxMDEwMTAwMTAxJyxcbiAgLy8gMTUxMC0xNTE0XG4gICcxMDExMDEwMTAwMTAnLCAnMTAxMTAxMTAxMDAxJywgJzAxMDEwMTExMDEwMScsICcwMDAxMDExMTAxMTAnLCAnMTAwMDEwMTEwMTExJyxcbiAgLy8gMTUxNS0xNTE5XG4gICcwMDEwMDEwMTEwMTEnLCAnMDEwMTAwMTAxMDExJywgJzAxMDEwMTEwMDEwMScsICcwMTAxMTAxMTAxMDAnLCAnMTAwMTExMDExMDEwJyxcbiAgLy8gMTUyMC0xNTI0XG4gICcwMTAwMTExMDExMDEnLCAnMDAwMTAxMTAxMTAxJywgJzEwMDAxMDExMDExMCcsICcxMDEwMTAxMDAxMTAnLCAnMTEwMTAxMDEwMDEwJyxcbiAgLy8gMTUyNS0xNTI5XG4gICcxMTAxMTAxMDEwMDEnLCAnMDEwMTExMDEwMTAwJywgJzEwMTAxMTAxMTAxMCcsICcxMDAxMDEwMTEwMTEnLCAnMDEwMDEwMTAxMDExJyxcbiAgLy8gMTUzMC0xNTM0XG4gICcwMTEwMDEwMTAwMTEnLCAnMDExMTAwMTAxMDAxJywgJzAxMTEwMTEwMDAxMCcsICcxMDExMTAxMDEwMDEnLCAnMDEwMTEwMTEwMDEwJyxcbiAgLy8gMTUzNS0xNTM5XG4gICcxMDEwMTAxMTAxMDEnLCAnMDEwMTAxMDEwMTAxJywgJzEwMTEwMDEwMDEwMScsICcxMTAxMTAwMTAwMTAnLCAnMTExMDExMDAxMDAxJyxcbiAgLy8gMTU0MC0xNTQ0XG4gICcwMTEwMTEwMTAwMTAnLCAnMTAxMDExMTAxMDAxJywgJzAxMDEwMTEwMTAxMScsICcwMTAwMTAxMDEwMTEnLCAnMTAxMDAxMDEwMTAxJyxcbiAgLy8gMTU0NS0xNTQ5XG4gICcxMTAxMDAxMDEwMDEnLCAnMTEwMTAxMDEwMTAwJywgJzExMDExMDEwMTAxMCcsICcxMDAxMTAxMTAxMDEnLCAnMDEwMDEwMTExMDEwJyxcbiAgLy8gMTU1MC0xNTU0XG4gICcxMDEwMDAxMTEwMTEnLCAnMDEwMDEwMDExMDExJywgJzEwMTAwMTAwMTEwMScsICcxMDEwMTAxMDEwMTAnLCAnMTAxMDExMDEwMTAxJyxcbiAgLy8gMTU1NS0xNTU5XG4gICcwMDEwMTEwMTEwMTAnLCAnMTAwMTAxMDExMTAxJywgJzAxMDAwMTAxMTExMCcsICcxMDEwMDAxMDExMTAnLCAnMTEwMDEwMDExMDEwJyxcbiAgLy8gMTU2MC0xNTY0XG4gICcxMTAxMDEwMTAxMDEnLCAnMDExMDEwMTEwMDEwJywgJzAxMTAxMDExMTAwMScsICcwMTAwMTAxMTEwMTAnLCAnMTAxMDAxMDExMTAxJyxcbiAgLy8gMTU2NS0xNTY5XG4gICcwMTAxMDAxMDExMDEnLCAnMTAxMDEwMDEwMTAxJywgJzEwMTEwMTAxMDAxMCcsICcxMDExMTAxMDEwMDAnLCAnMTAxMTEwMTEwMTAwJyxcbiAgLy8gMTU3MC0xNTc0XG4gICcwMTAxMTAxMTEwMDEnLCAnMDAxMDExMDExMDEwJywgJzEwMDEwMTAxMTAxMCcsICcxMDExMDEwMDEwMTAnLCAnMTEwMTEwMTAwMTAwJyxcbiAgLy8gMTU3NS0xNTc5XG4gICcxMTEwMTEwMTAwMDEnLCAnMDExMDExMTAxMDAwJywgJzEwMTEwMTEwMTAxMCcsICcwMTAxMDExMDExMDEnLCAnMDEwMTAwMTEwMTAxJyxcbiAgLy8gMTU4MC0xNTg0XG4gICcwMTEwMTAwMTAxMDEnLCAnMTEwMTAxMDAxMDEwJywgJzExMDExMDEwMTAwMCcsICcxMTAxMTEwMTAxMDAnLCAnMDExMDExMDExMDEwJyxcbiAgLy8gMTU4NS0xNTg5XG4gICcwMTAxMDEwMTEwMTEnLCAnMDAxMDEwMDExMTAxJywgJzAxMTAwMDEwMTAxMScsICcxMDExMDAwMTAxMDEnLCAnMTAxMTAxMDAxMDEwJyxcbiAgLy8gMTU5MC0xNTk0XG4gICcxMDExMTAwMTAxMDEnLCAnMDEwMTEwMTAxMDEwJywgJzEwMTAxMDEwMTExMCcsICcxMDAxMDAxMDExMTAnLCAnMTEwMDEwMDAxMTExJyxcbiAgLy8gMTU5NS0xNTk5XG4gICcwMTAxMDAxMDAxMTEnLCAnMDExMDEwMDEwMTAxJywgJzAxMTAxMDEwMTAxMCcsICcxMDEwMTEwMTAxMTAnLCAnMDEwMTAxMDExMTAxJyxcbiAgLy8gMTYwMFxuICAnMDAxMDEwMDExMTAxJ1xuXTtcblxuZnVuY3Rpb24gZ2V0RGF5c0RpZmYoZGF0ZTE6IERhdGUsIGRhdGUyOiBEYXRlKTogbnVtYmVyIHtcbiAgY29uc3QgZGlmZiA9IE1hdGguYWJzKGRhdGUxLmdldFRpbWUoKSAtIGRhdGUyLmdldFRpbWUoKSk7XG4gIHJldHVybiBNYXRoLnJvdW5kKGRpZmYgLyBPTkVfREFZKTtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5nYkNhbGVuZGFySXNsYW1pY1VtYWxxdXJhIGV4dGVuZHMgTmdiQ2FsZW5kYXJJc2xhbWljQ2l2aWwge1xuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBlcXVpdmFsZW50IGlzbGFtaWMoVW1hbHF1cmEpIGRhdGUgdmFsdWUgZm9yIGEgZ2l2ZSBpbnB1dCBHcmVnb3JpYW4gZGF0ZS5cbiAgKiBgZ2RhdGVgIGlzIHMgSlMgRGF0ZSB0byBiZSBjb252ZXJ0ZWQgdG8gSGlqcmkuXG4gICovXG4gIGZyb21HcmVnb3JpYW4oZ0RhdGU6IERhdGUpOiBOZ2JEYXRlIHtcbiAgICBsZXQgaERheSA9IDEsIGhNb250aCA9IDAsIGhZZWFyID0gMTMwMDtcbiAgICBsZXQgZGF5c0RpZmYgPSBnZXREYXlzRGlmZihnRGF0ZSwgR1JFR09SSUFOX0ZJUlNUX0RBVEUpO1xuICAgIGlmIChnRGF0ZS5nZXRUaW1lKCkgLSBHUkVHT1JJQU5fRklSU1RfREFURS5nZXRUaW1lKCkgPj0gMCAmJiBnRGF0ZS5nZXRUaW1lKCkgLSBHUkVHT1JJQU5fTEFTVF9EQVRFLmdldFRpbWUoKSA8PSAwKSB7XG4gICAgICBsZXQgeWVhciA9IDEzMDA7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1PTlRIX0xFTkdUSC5sZW5ndGg7IGkrKywgeWVhcisrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTI7IGorKykge1xuICAgICAgICAgIGxldCBudW1PZkRheXMgPSArTU9OVEhfTEVOR1RIW2ldW2pdICsgMjk7XG4gICAgICAgICAgaWYgKGRheXNEaWZmIDw9IG51bU9mRGF5cykge1xuICAgICAgICAgICAgaERheSA9IGRheXNEaWZmICsgMTtcbiAgICAgICAgICAgIGlmIChoRGF5ID4gbnVtT2ZEYXlzKSB7XG4gICAgICAgICAgICAgIGhEYXkgPSAxO1xuICAgICAgICAgICAgICBqKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaiA+IDExKSB7XG4gICAgICAgICAgICAgIGogPSAwO1xuICAgICAgICAgICAgICB5ZWFyKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoTW9udGggPSBqO1xuICAgICAgICAgICAgaFllYXIgPSB5ZWFyO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBOZ2JEYXRlKGhZZWFyLCBoTW9udGggKyAxLCBoRGF5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGF5c0RpZmYgPSBkYXlzRGlmZiAtIG51bU9mRGF5cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3VwZXIuZnJvbUdyZWdvcmlhbihnRGF0ZSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAqIENvbnZlcnRzIHRoZSBjdXJyZW50IEhpanJpIGRhdGUgdG8gR3JlZ29yaWFuLlxuICAqL1xuICB0b0dyZWdvcmlhbihoRGF0ZTogTmdiRGF0ZSk6IERhdGUge1xuICAgIGNvbnN0IGhZZWFyID0gaERhdGUueWVhcjtcbiAgICBjb25zdCBoTW9udGggPSBoRGF0ZS5tb250aCAtIDE7XG4gICAgY29uc3QgaERheSA9IGhEYXRlLmRheTtcbiAgICBsZXQgZ0RhdGUgPSBuZXcgRGF0ZShHUkVHT1JJQU5fRklSU1RfREFURSk7XG4gICAgbGV0IGRheURpZmYgPSBoRGF5IC0gMTtcbiAgICBpZiAoaFllYXIgPj0gSElKUklfQkVHSU4gJiYgaFllYXIgPD0gSElKUklfRU5EKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGhZZWFyIC0gSElKUklfQkVHSU47IHkrKykge1xuICAgICAgICBmb3IgKGxldCBtID0gMDsgbSA8IDEyOyBtKyspIHtcbiAgICAgICAgICBkYXlEaWZmICs9ICtNT05USF9MRU5HVEhbeV1bbV0gKyAyOTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgbSA9IDA7IG0gPCBoTW9udGg7IG0rKykge1xuICAgICAgICBkYXlEaWZmICs9ICtNT05USF9MRU5HVEhbaFllYXIgLSBISUpSSV9CRUdJTl1bbV0gKyAyOTtcbiAgICAgIH1cbiAgICAgIGdEYXRlLnNldERhdGUoR1JFR09SSUFOX0ZJUlNUX0RBVEUuZ2V0RGF0ZSgpICsgZGF5RGlmZik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdEYXRlID0gc3VwZXIudG9HcmVnb3JpYW4oaERhdGUpO1xuICAgIH1cbiAgICByZXR1cm4gZ0RhdGU7XG4gIH1cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGRheXMgaW4gYSBzcGVjaWZpYyBIaWpyaSBoTW9udGguXG4gICogYGhNb250aGAgaXMgMSBmb3IgTXVoYXJyYW0sIDIgZm9yIFNhZmFyLCBldGMuXG4gICogYGhZZWFyYCBpcyBhbnkgSGlqcmkgaFllYXIuXG4gICovXG4gIGdldERheXNQZXJNb250aChoTW9udGg6IG51bWJlciwgaFllYXI6IG51bWJlcik6IG51bWJlciB7XG4gICAgaWYgKGhZZWFyID49IEhJSlJJX0JFR0lOICYmIGhZZWFyIDw9IEhJSlJJX0VORCkge1xuICAgICAgY29uc3QgcG9zID0gaFllYXIgLSBISUpSSV9CRUdJTjtcbiAgICAgIHJldHVybiArTU9OVEhfTEVOR1RIW3Bvc11baE1vbnRoIC0gMV0gKyAyOTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLmdldERheXNQZXJNb250aChoTW9udGgsIGhZZWFyKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuLi9uZ2ItZGF0ZSc7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZXF1aXZhbGVudCBKUyBkYXRlIHZhbHVlIGZvciBhIGdpdmUgaW5wdXQgSmFsYWxpIGRhdGUuXG4gKiBgamFsYWxpRGF0ZWAgaXMgYW4gSmFsYWxpIGRhdGUgdG8gYmUgY29udmVydGVkIHRvIEdyZWdvcmlhbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvR3JlZ29yaWFuKGphbGFsaURhdGU6IE5nYkRhdGUpOiBEYXRlIHtcbiAgbGV0IGpkbiA9IGphbGFsaVRvSnVsaWFuKGphbGFsaURhdGUueWVhciwgamFsYWxpRGF0ZS5tb250aCwgamFsYWxpRGF0ZS5kYXkpO1xuICBsZXQgZGF0ZSA9IGp1bGlhblRvR3JlZ29yaWFuKGpkbik7XG4gIGRhdGUuc2V0SG91cnMoNiwgMzAsIDMsIDIwMCk7XG4gIHJldHVybiBkYXRlO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGVxdWl2YWxlbnQgamFsYWxpIGRhdGUgdmFsdWUgZm9yIGEgZ2l2ZSBpbnB1dCBHcmVnb3JpYW4gZGF0ZS5cbiAqIGBnZGF0ZWAgaXMgYSBKUyBEYXRlIHRvIGJlIGNvbnZlcnRlZCB0byBqYWxhbGkuXG4gKiB1dGMgdG8gbG9jYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21HcmVnb3JpYW4oZ2RhdGU6IERhdGUpOiBOZ2JEYXRlIHtcbiAgbGV0IGcyZCA9IGdyZWdvcmlhblRvSnVsaWFuKGdkYXRlLmdldEZ1bGxZZWFyKCksIGdkYXRlLmdldE1vbnRoKCkgKyAxLCBnZGF0ZS5nZXREYXRlKCkpO1xuICByZXR1cm4ganVsaWFuVG9KYWxhbGkoZzJkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEphbGFsaVllYXIoZGF0ZTogTmdiRGF0ZSwgeWVhclZhbHVlOiBudW1iZXIpOiBOZ2JEYXRlIHtcbiAgZGF0ZS55ZWFyID0gK3llYXJWYWx1ZTtcbiAgcmV0dXJuIGRhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRKYWxhbGlNb250aChkYXRlOiBOZ2JEYXRlLCBtb250aDogbnVtYmVyKTogTmdiRGF0ZSB7XG4gIG1vbnRoID0gK21vbnRoO1xuICBkYXRlLnllYXIgPSBkYXRlLnllYXIgKyBNYXRoLmZsb29yKChtb250aCAtIDEpIC8gMTIpO1xuICBkYXRlLm1vbnRoID0gTWF0aC5mbG9vcigoKG1vbnRoIC0gMSkgJSAxMiArIDEyKSAlIDEyKSArIDE7XG4gIHJldHVybiBkYXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0SmFsYWxpRGF5KGRhdGU6IE5nYkRhdGUsIGRheTogbnVtYmVyKTogTmdiRGF0ZSB7XG4gIGxldCBtRGF5cyA9IGdldERheXNQZXJNb250aChkYXRlLm1vbnRoLCBkYXRlLnllYXIpO1xuICBpZiAoZGF5IDw9IDApIHtcbiAgICB3aGlsZSAoZGF5IDw9IDApIHtcbiAgICAgIGRhdGUgPSBzZXRKYWxhbGlNb250aChkYXRlLCBkYXRlLm1vbnRoIC0gMSk7XG4gICAgICBtRGF5cyA9IGdldERheXNQZXJNb250aChkYXRlLm1vbnRoLCBkYXRlLnllYXIpO1xuICAgICAgZGF5ICs9IG1EYXlzO1xuICAgIH1cbiAgfSBlbHNlIGlmIChkYXkgPiBtRGF5cykge1xuICAgIHdoaWxlIChkYXkgPiBtRGF5cykge1xuICAgICAgZGF5IC09IG1EYXlzO1xuICAgICAgZGF0ZSA9IHNldEphbGFsaU1vbnRoKGRhdGUsIGRhdGUubW9udGggKyAxKTtcbiAgICAgIG1EYXlzID0gZ2V0RGF5c1Blck1vbnRoKGRhdGUubW9udGgsIGRhdGUueWVhcik7XG4gICAgfVxuICB9XG4gIGRhdGUuZGF5ID0gZGF5O1xuICByZXR1cm4gZGF0ZTtcbn1cblxuZnVuY3Rpb24gbW9kKGE6IG51bWJlciwgYjogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIGEgLSBiICogTWF0aC5mbG9vcihhIC8gYik7XG59XG5cbmZ1bmN0aW9uIGRpdihhOiBudW1iZXIsIGI6IG51bWJlcikge1xuICByZXR1cm4gTWF0aC50cnVuYyhhIC8gYik7XG59XG5cbi8qXG4gVGhpcyBmdW5jdGlvbiBkZXRlcm1pbmVzIGlmIHRoZSBKYWxhbGkgKFBlcnNpYW4pIHllYXIgaXNcbiBsZWFwICgzNjYtZGF5IGxvbmcpIG9yIGlzIHRoZSBjb21tb24geWVhciAoMzY1IGRheXMpLCBhbmRcbiBmaW5kcyB0aGUgZGF5IGluIE1hcmNoIChHcmVnb3JpYW4gY2FsZW5kYXIpIG9mIHRoZSBmaXJzdFxuIGRheSBvZiB0aGUgSmFsYWxpIHllYXIgKGphbGFsaVllYXIpLlxuIEBwYXJhbSBqYWxhbGlZZWFyIEphbGFsaSBjYWxlbmRhciB5ZWFyICgtNjEgdG8gMzE3NylcbiBAcmV0dXJuXG4gbGVhcDogbnVtYmVyIG9mIHllYXJzIHNpbmNlIHRoZSBsYXN0IGxlYXAgeWVhciAoMCB0byA0KVxuIGdZZWFyOiBHcmVnb3JpYW4geWVhciBvZiB0aGUgYmVnaW5uaW5nIG9mIEphbGFsaSB5ZWFyXG4gbWFyY2g6IHRoZSBNYXJjaCBkYXkgb2YgRmFydmFyZGluIHRoZSAxc3QgKDFzdCBkYXkgb2YgamFsYWxpWWVhcilcbiBAc2VlOiBodHRwOi8vd3d3LmFzdHJvLnVuaS50b3J1bi5wbC9+a2IvUGFwZXJzL0VNUC9QZXJzaWFuQy1FTVAuaHRtXG4gQHNlZTogaHR0cDovL3d3dy5mb3VybWlsYWIuY2gvZG9jdW1lbnRzL2NhbGVuZGFyL1xuICovXG5mdW5jdGlvbiBqYWxDYWwoamFsYWxpWWVhcjogbnVtYmVyKSB7XG4gIC8vIEphbGFsaSB5ZWFycyBzdGFydGluZyB0aGUgMzMteWVhciBydWxlLlxuICBsZXQgYnJlYWtzID1cbiAgICAgIFstNjEsIDksIDM4LCAxOTksIDQyNiwgNjg2LCA3NTYsIDgxOCwgMTExMSwgMTE4MSwgMTIxMCwgMTYzNSwgMjA2MCwgMjA5NywgMjE5MiwgMjI2MiwgMjMyNCwgMjM5NCwgMjQ1NiwgMzE3OF07XG4gIGNvbnN0IGJyZWFrc0xlbmd0aCA9IGJyZWFrcy5sZW5ndGg7XG4gIGNvbnN0IGdZZWFyID0gamFsYWxpWWVhciArIDYyMTtcbiAgbGV0IGxlYXBKID0gLTE0O1xuICBsZXQganAgPSBicmVha3NbMF07XG5cbiAgaWYgKGphbGFsaVllYXIgPCBqcCB8fCBqYWxhbGlZZWFyID49IGJyZWFrc1ticmVha3NMZW5ndGggLSAxXSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBKYWxhbGkgeWVhciAnICsgamFsYWxpWWVhcik7XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsaW1pdGluZyB5ZWFycyBmb3IgdGhlIEphbGFsaSB5ZWFyIGphbGFsaVllYXIuXG4gIGxldCBqdW1wO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IGJyZWFrc0xlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3Qgam0gPSBicmVha3NbaV07XG4gICAganVtcCA9IGptIC0ganA7XG4gICAgaWYgKGphbGFsaVllYXIgPCBqbSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxlYXBKID0gbGVhcEogKyBkaXYoanVtcCwgMzMpICogOCArIGRpdihtb2QoanVtcCwgMzMpLCA0KTtcbiAgICBqcCA9IGptO1xuICB9XG4gIGxldCBuID0gamFsYWxpWWVhciAtIGpwO1xuXG4gIC8vIEZpbmQgdGhlIG51bWJlciBvZiBsZWFwIHllYXJzIGZyb20gQUQgNjIxIHRvIHRoZSBiZWdpbm5pbmdcbiAgLy8gb2YgdGhlIGN1cnJlbnQgSmFsYWxpIHllYXIgaW4gdGhlIFBlcnNpYW4gY2FsZW5kYXIuXG4gIGxlYXBKID0gbGVhcEogKyBkaXYobiwgMzMpICogOCArIGRpdihtb2QobiwgMzMpICsgMywgNCk7XG4gIGlmIChtb2QoanVtcCwgMzMpID09PSA0ICYmIGp1bXAgLSBuID09PSA0KSB7XG4gICAgbGVhcEogKz0gMTtcbiAgfVxuXG4gIC8vIEFuZCB0aGUgc2FtZSBpbiB0aGUgR3JlZ29yaWFuIGNhbGVuZGFyICh1bnRpbCB0aGUgeWVhciBnWWVhcikuXG4gIGNvbnN0IGxlYXBHID0gZGl2KGdZZWFyLCA0KSAtIGRpdigoZGl2KGdZZWFyLCAxMDApICsgMSkgKiAzLCA0KSAtIDE1MDtcblxuICAvLyBEZXRlcm1pbmUgdGhlIEdyZWdvcmlhbiBkYXRlIG9mIEZhcnZhcmRpbiB0aGUgMXN0LlxuICBjb25zdCBtYXJjaCA9IDIwICsgbGVhcEogLSBsZWFwRztcblxuICAvLyBGaW5kIGhvdyBtYW55IHllYXJzIGhhdmUgcGFzc2VkIHNpbmNlIHRoZSBsYXN0IGxlYXAgeWVhci5cbiAgaWYgKGp1bXAgLSBuIDwgNikge1xuICAgIG4gPSBuIC0ganVtcCArIGRpdihqdW1wICsgNCwgMzMpICogMzM7XG4gIH1cbiAgbGV0IGxlYXAgPSBtb2QobW9kKG4gKyAxLCAzMykgLSAxLCA0KTtcbiAgaWYgKGxlYXAgPT09IC0xKSB7XG4gICAgbGVhcCA9IDQ7XG4gIH1cblxuICByZXR1cm4ge2xlYXA6IGxlYXAsIGd5OiBnWWVhciwgbWFyY2g6IG1hcmNofTtcbn1cblxuLypcbiBDYWxjdWxhdGVzIEdyZWdvcmlhbiBhbmQgSnVsaWFuIGNhbGVuZGFyIGRhdGVzIGZyb20gdGhlIEp1bGlhbiBEYXkgbnVtYmVyXG4gKGpkbikgZm9yIHRoZSBwZXJpb2Qgc2luY2UgamRuPS0zNDgzOTY1NSAoaS5lLiB0aGUgeWVhciAtMTAwMTAwIG9mIGJvdGhcbiBjYWxlbmRhcnMpIHRvIHNvbWUgbWlsbGlvbnMgeWVhcnMgYWhlYWQgb2YgdGhlIHByZXNlbnQuXG4gQHBhcmFtIGpkbiBKdWxpYW4gRGF5IG51bWJlclxuIEByZXR1cm5cbiBnWWVhcjogQ2FsZW5kYXIgeWVhciAoeWVhcnMgQkMgbnVtYmVyZWQgMCwgLTEsIC0yLCAuLi4pXG4gZ01vbnRoOiBDYWxlbmRhciBtb250aCAoMSB0byAxMilcbiBnRGF5OiBDYWxlbmRhciBkYXkgb2YgdGhlIG1vbnRoIE0gKDEgdG8gMjgvMjkvMzAvMzEpXG4gKi9cbmZ1bmN0aW9uIGp1bGlhblRvR3JlZ29yaWFuKGp1bGlhbkRheU51bWJlcjogbnVtYmVyKSB7XG4gIGxldCBqID0gNCAqIGp1bGlhbkRheU51bWJlciArIDEzOTM2MTYzMTtcbiAgaiA9IGogKyBkaXYoZGl2KDQgKiBqdWxpYW5EYXlOdW1iZXIgKyAxODMxODc3MjAsIDE0NjA5NykgKiAzLCA0KSAqIDQgLSAzOTA4O1xuICBjb25zdCBpID0gZGl2KG1vZChqLCAxNDYxKSwgNCkgKiA1ICsgMzA4O1xuICBjb25zdCBnRGF5ID0gZGl2KG1vZChpLCAxNTMpLCA1KSArIDE7XG4gIGNvbnN0IGdNb250aCA9IG1vZChkaXYoaSwgMTUzKSwgMTIpICsgMTtcbiAgY29uc3QgZ1llYXIgPSBkaXYoaiwgMTQ2MSkgLSAxMDAxMDAgKyBkaXYoOCAtIGdNb250aCwgNik7XG5cbiAgcmV0dXJuIG5ldyBEYXRlKGdZZWFyLCBnTW9udGggLSAxLCBnRGF5KTtcbn1cblxuLypcbiBDb252ZXJ0cyBhIGRhdGUgb2YgdGhlIEphbGFsaSBjYWxlbmRhciB0byB0aGUgSnVsaWFuIERheSBudW1iZXIuXG4gQHBhcmFtIGp5IEphbGFsaSB5ZWFyICgxIHRvIDMxMDApXG4gQHBhcmFtIGptIEphbGFsaSBtb250aCAoMSB0byAxMilcbiBAcGFyYW0gamQgSmFsYWxpIGRheSAoMSB0byAyOS8zMSlcbiBAcmV0dXJuIEp1bGlhbiBEYXkgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGdyZWdvcmlhblRvSnVsaWFuKGd5OiBudW1iZXIsIGdtOiBudW1iZXIsIGdkOiBudW1iZXIpIHtcbiAgbGV0IGQgPSBkaXYoKGd5ICsgZGl2KGdtIC0gOCwgNikgKyAxMDAxMDApICogMTQ2MSwgNCkgKyBkaXYoMTUzICogbW9kKGdtICsgOSwgMTIpICsgMiwgNSkgKyBnZCAtIDM0ODQwNDA4O1xuICBkID0gZCAtIGRpdihkaXYoZ3kgKyAxMDAxMDAgKyBkaXYoZ20gLSA4LCA2KSwgMTAwKSAqIDMsIDQpICsgNzUyO1xuICByZXR1cm4gZDtcbn1cblxuLypcbiBDb252ZXJ0cyB0aGUgSnVsaWFuIERheSBudW1iZXIgdG8gYSBkYXRlIGluIHRoZSBKYWxhbGkgY2FsZW5kYXIuXG4gQHBhcmFtIGp1bGlhbkRheU51bWJlciBKdWxpYW4gRGF5IG51bWJlclxuIEByZXR1cm5cbiBqYWxhbGlZZWFyOiBKYWxhbGkgeWVhciAoMSB0byAzMTAwKVxuIGphbGFsaU1vbnRoOiBKYWxhbGkgbW9udGggKDEgdG8gMTIpXG4gamFsYWxpRGF5OiBKYWxhbGkgZGF5ICgxIHRvIDI5LzMxKVxuICovXG5mdW5jdGlvbiBqdWxpYW5Ub0phbGFsaShqdWxpYW5EYXlOdW1iZXI6IG51bWJlcikge1xuICBsZXQgZ3kgPSBqdWxpYW5Ub0dyZWdvcmlhbihqdWxpYW5EYXlOdW1iZXIpLmdldEZ1bGxZZWFyKCkgIC8vIENhbGN1bGF0ZSBHcmVnb3JpYW4geWVhciAoZ3kpLlxuICAgICAgLFxuICAgICAgamFsYWxpWWVhciA9IGd5IC0gNjIxLCByID0gamFsQ2FsKGphbGFsaVllYXIpLCBncmVnb3JpYW5EYXkgPSBncmVnb3JpYW5Ub0p1bGlhbihneSwgMywgci5tYXJjaCksIGphbGFsaURheSxcbiAgICAgIGphbGFsaU1vbnRoLCBudW1iZXJPZkRheXM7XG5cbiAgLy8gRmluZCBudW1iZXIgb2YgZGF5cyB0aGF0IHBhc3NlZCBzaW5jZSAxIEZhcnZhcmRpbi5cbiAgbnVtYmVyT2ZEYXlzID0ganVsaWFuRGF5TnVtYmVyIC0gZ3JlZ29yaWFuRGF5O1xuICBpZiAobnVtYmVyT2ZEYXlzID49IDApIHtcbiAgICBpZiAobnVtYmVyT2ZEYXlzIDw9IDE4NSkge1xuICAgICAgLy8gVGhlIGZpcnN0IDYgbW9udGhzLlxuICAgICAgamFsYWxpTW9udGggPSAxICsgZGl2KG51bWJlck9mRGF5cywgMzEpO1xuICAgICAgamFsYWxpRGF5ID0gbW9kKG51bWJlck9mRGF5cywgMzEpICsgMTtcbiAgICAgIHJldHVybiBuZXcgTmdiRGF0ZShqYWxhbGlZZWFyLCBqYWxhbGlNb250aCwgamFsYWxpRGF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHJlbWFpbmluZyBtb250aHMuXG4gICAgICBudW1iZXJPZkRheXMgLT0gMTg2O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBQcmV2aW91cyBKYWxhbGkgeWVhci5cbiAgICBqYWxhbGlZZWFyIC09IDE7XG4gICAgbnVtYmVyT2ZEYXlzICs9IDE3OTtcbiAgICBpZiAoci5sZWFwID09PSAxKSB7XG4gICAgICBudW1iZXJPZkRheXMgKz0gMTtcbiAgICB9XG4gIH1cbiAgamFsYWxpTW9udGggPSA3ICsgZGl2KG51bWJlck9mRGF5cywgMzApO1xuICBqYWxhbGlEYXkgPSBtb2QobnVtYmVyT2ZEYXlzLCAzMCkgKyAxO1xuXG4gIHJldHVybiBuZXcgTmdiRGF0ZShqYWxhbGlZZWFyLCBqYWxhbGlNb250aCwgamFsYWxpRGF5KTtcbn1cblxuLypcbiBDb252ZXJ0cyBhIGRhdGUgb2YgdGhlIEphbGFsaSBjYWxlbmRhciB0byB0aGUgSnVsaWFuIERheSBudW1iZXIuXG4gQHBhcmFtIGpZZWFyIEphbGFsaSB5ZWFyICgxIHRvIDMxMDApXG4gQHBhcmFtIGpNb250aCBKYWxhbGkgbW9udGggKDEgdG8gMTIpXG4gQHBhcmFtIGpEYXkgSmFsYWxpIGRheSAoMSB0byAyOS8zMSlcbiBAcmV0dXJuIEp1bGlhbiBEYXkgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGphbGFsaVRvSnVsaWFuKGpZZWFyOiBudW1iZXIsIGpNb250aDogbnVtYmVyLCBqRGF5OiBudW1iZXIpIHtcbiAgbGV0IHIgPSBqYWxDYWwoalllYXIpO1xuICByZXR1cm4gZ3JlZ29yaWFuVG9KdWxpYW4oci5neSwgMywgci5tYXJjaCkgKyAoak1vbnRoIC0gMSkgKiAzMSAtIGRpdihqTW9udGgsIDcpICogKGpNb250aCAtIDcpICsgakRheSAtIDE7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGRheXMgaW4gYSBzcGVjaWZpYyBqYWxhbGkgbW9udGguXG4gKi9cbmZ1bmN0aW9uIGdldERheXNQZXJNb250aChtb250aDogbnVtYmVyLCB5ZWFyOiBudW1iZXIpOiBudW1iZXIge1xuICBpZiAobW9udGggPD0gNikge1xuICAgIHJldHVybiAzMTtcbiAgfVxuICBpZiAobW9udGggPD0gMTEpIHtcbiAgICByZXR1cm4gMzA7XG4gIH1cbiAgaWYgKGphbENhbCh5ZWFyKS5sZWFwID09PSAwKSB7XG4gICAgcmV0dXJuIDMwO1xuICB9XG4gIHJldHVybiAyOTtcbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nYkRhdGV9IGZyb20gJy4uL25nYi1kYXRlJztcbmltcG9ydCB7TmdiQ2FsZW5kYXIsIE5nYlBlcmlvZH0gZnJvbSAnLi4vbmdiLWNhbGVuZGFyJztcbmltcG9ydCB7aXNJbnRlZ2VyfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuXG5pbXBvcnQge2Zyb21HcmVnb3JpYW4sIHNldEphbGFsaURheSwgc2V0SmFsYWxpTW9udGgsIHNldEphbGFsaVllYXIsIHRvR3JlZ29yaWFufSBmcm9tICcuL2phbGFsaSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JDYWxlbmRhclBlcnNpYW4gZXh0ZW5kcyBOZ2JDYWxlbmRhciB7XG4gIGdldERheXNQZXJXZWVrKCkgeyByZXR1cm4gNzsgfVxuXG4gIGdldE1vbnRocygpIHsgcmV0dXJuIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyXTsgfVxuXG4gIGdldFdlZWtzUGVyTW9udGgoKSB7IHJldHVybiA2OyB9XG5cbiAgZ2V0TmV4dChkYXRlOiBOZ2JEYXRlLCBwZXJpb2Q6IE5nYlBlcmlvZCA9ICdkJywgbnVtYmVyID0gMSkge1xuICAgIGRhdGUgPSBuZXcgTmdiRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGgsIGRhdGUuZGF5KTtcblxuICAgIHN3aXRjaCAocGVyaW9kKSB7XG4gICAgICBjYXNlICd5JzpcbiAgICAgICAgZGF0ZSA9IHNldEphbGFsaVllYXIoZGF0ZSwgZGF0ZS55ZWFyICsgbnVtYmVyKTtcbiAgICAgICAgZGF0ZS5tb250aCA9IDE7XG4gICAgICAgIGRhdGUuZGF5ID0gMTtcbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICBjYXNlICdtJzpcbiAgICAgICAgZGF0ZSA9IHNldEphbGFsaU1vbnRoKGRhdGUsIGRhdGUubW9udGggKyBudW1iZXIpO1xuICAgICAgICBkYXRlLmRheSA9IDE7XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgY2FzZSAnZCc6XG4gICAgICAgIHJldHVybiBzZXRKYWxhbGlEYXkoZGF0ZSwgZGF0ZS5kYXkgKyBudW1iZXIpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICB9XG5cbiAgZ2V0UHJldihkYXRlOiBOZ2JEYXRlLCBwZXJpb2Q6IE5nYlBlcmlvZCA9ICdkJywgbnVtYmVyID0gMSkgeyByZXR1cm4gdGhpcy5nZXROZXh0KGRhdGUsIHBlcmlvZCwgLW51bWJlcik7IH1cblxuICBnZXRXZWVrZGF5KGRhdGU6IE5nYkRhdGUpIHtcbiAgICBjb25zdCBkYXkgPSB0b0dyZWdvcmlhbihkYXRlKS5nZXREYXkoKTtcbiAgICAvLyBpbiBKUyBEYXRlIFN1bj0wLCBpbiBJU08gODYwMSBTdW49N1xuICAgIHJldHVybiBkYXkgPT09IDAgPyA3IDogZGF5O1xuICB9XG5cbiAgZ2V0V2Vla051bWJlcih3ZWVrOiBOZ2JEYXRlW10sIGZpcnN0RGF5T2ZXZWVrOiBudW1iZXIpIHtcbiAgICAvLyBpbiBKUyBEYXRlIFN1bj0wLCBpbiBJU08gODYwMSBTdW49N1xuICAgIGlmIChmaXJzdERheU9mV2VlayA9PT0gNykge1xuICAgICAgZmlyc3REYXlPZldlZWsgPSAwO1xuICAgIH1cblxuICAgIGNvbnN0IHRodXJzZGF5SW5kZXggPSAoNCArIDcgLSBmaXJzdERheU9mV2VlaykgJSA3O1xuICAgIGNvbnN0IGRhdGUgPSB3ZWVrW3RodXJzZGF5SW5kZXhdO1xuXG4gICAgY29uc3QganNEYXRlID0gdG9HcmVnb3JpYW4oZGF0ZSk7XG4gICAganNEYXRlLnNldERhdGUoanNEYXRlLmdldERhdGUoKSArIDQgLSAoanNEYXRlLmdldERheSgpIHx8IDcpKTsgIC8vIFRodXJzZGF5XG4gICAgY29uc3QgdGltZSA9IGpzRGF0ZS5nZXRUaW1lKCk7XG4gICAgY29uc3Qgc3RhcnREYXRlID0gdG9HcmVnb3JpYW4obmV3IE5nYkRhdGUoZGF0ZS55ZWFyLCAxLCAxKSk7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yb3VuZCgodGltZSAtIHN0YXJ0RGF0ZS5nZXRUaW1lKCkpIC8gODY0MDAwMDApIC8gNykgKyAxO1xuICB9XG5cbiAgZ2V0VG9kYXkoKTogTmdiRGF0ZSB7IHJldHVybiBmcm9tR3JlZ29yaWFuKG5ldyBEYXRlKCkpOyB9XG5cbiAgaXNWYWxpZChkYXRlOiBOZ2JEYXRlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRhdGUgJiYgaXNJbnRlZ2VyKGRhdGUueWVhcikgJiYgaXNJbnRlZ2VyKGRhdGUubW9udGgpICYmIGlzSW50ZWdlcihkYXRlLmRheSkgJiZcbiAgICAgICAgIWlzTmFOKHRvR3JlZ29yaWFuKGRhdGUpLmdldFRpbWUoKSk7XG4gIH1cbn1cbiIsImltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi4vbmdiLWRhdGUnO1xuaW1wb3J0IHtOZ2JEYXRlU3RydWN0fSBmcm9tICcuLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuXG5jb25zdCBQQVJUU19QRVJfSE9VUiA9IDEwODA7XG5jb25zdCBQQVJUU19QRVJfREFZID0gMjQgKiBQQVJUU19QRVJfSE9VUjtcbmNvbnN0IFBBUlRTX0ZSQUNUSU9OQUxfTU9OVEggPSAxMiAqIFBBUlRTX1BFUl9IT1VSICsgNzkzO1xuY29uc3QgUEFSVFNfUEVSX01PTlRIID0gMjkgKiBQQVJUU19QRVJfREFZICsgUEFSVFNfRlJBQ1RJT05BTF9NT05USDtcbmNvbnN0IEJBSEFSQUQgPSAxMSAqIFBBUlRTX1BFUl9IT1VSICsgMjA0O1xuY29uc3QgSEVCUkVXX0RBWV9PTl9KQU5fMV8xOTcwID0gMjA5MjU5MTtcbmNvbnN0IEdSRUdPUklBTl9FUE9DSCA9IDE3MjE0MjUuNTtcblxuZnVuY3Rpb24gaXNHcmVnb3JpYW5MZWFwWWVhcih5ZWFyOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIHllYXIgJSA0ID09PSAwICYmIHllYXIgJSAxMDAgIT09IDAgfHwgeWVhciAlIDQwMCA9PT0gMDtcbn1cblxuZnVuY3Rpb24gbnVtYmVyT2ZGaXJzdERheUluWWVhcih5ZWFyOiBudW1iZXIpOiBudW1iZXIge1xuICBsZXQgbW9udGhzQmVmb3JlWWVhciA9IE1hdGguZmxvb3IoKDIzNSAqIHllYXIgLSAyMzQpIC8gMTkpO1xuICBsZXQgZnJhY3Rpb25hbE1vbnRoc0JlZm9yZVllYXIgPSBtb250aHNCZWZvcmVZZWFyICogUEFSVFNfRlJBQ1RJT05BTF9NT05USCArIEJBSEFSQUQ7XG4gIGxldCBkYXlOdW1iZXIgPSBtb250aHNCZWZvcmVZZWFyICogMjkgKyBNYXRoLmZsb29yKGZyYWN0aW9uYWxNb250aHNCZWZvcmVZZWFyIC8gUEFSVFNfUEVSX0RBWSk7XG4gIGxldCB0aW1lT2ZEYXkgPSBmcmFjdGlvbmFsTW9udGhzQmVmb3JlWWVhciAlIFBBUlRTX1BFUl9EQVk7XG5cbiAgbGV0IGRheU9mV2VlayA9IGRheU51bWJlciAlIDc7ICAvLyAwID09IE1vbmRheVxuXG4gIGlmIChkYXlPZldlZWsgPT09IDIgfHwgZGF5T2ZXZWVrID09PSA0IHx8IGRheU9mV2VlayA9PT0gNikge1xuICAgIGRheU51bWJlcisrO1xuICAgIGRheU9mV2VlayA9IGRheU51bWJlciAlIDc7XG4gIH1cbiAgaWYgKGRheU9mV2VlayA9PT0gMSAmJiB0aW1lT2ZEYXkgPiAxNSAqIFBBUlRTX1BFUl9IT1VSICsgMjA0ICYmICFpc0hlYnJld0xlYXBZZWFyKHllYXIpKSB7XG4gICAgZGF5TnVtYmVyICs9IDI7XG4gIH0gZWxzZSBpZiAoZGF5T2ZXZWVrID09PSAwICYmIHRpbWVPZkRheSA+IDIxICogUEFSVFNfUEVSX0hPVVIgKyA1ODkgJiYgaXNIZWJyZXdMZWFwWWVhcih5ZWFyIC0gMSkpIHtcbiAgICBkYXlOdW1iZXIrKztcbiAgfVxuICByZXR1cm4gZGF5TnVtYmVyO1xufVxuXG5mdW5jdGlvbiBnZXREYXlzSW5HcmVnb3JpYW5Nb250aChtb250aDogbnVtYmVyLCB5ZWFyOiBudW1iZXIpOiBudW1iZXIge1xuICBsZXQgZGF5cyA9IFszMSwgMjgsIDMxLCAzMCwgMzEsIDMwLCAzMSwgMzEsIDMwLCAzMSwgMzAsIDMxXTtcbiAgaWYgKGlzR3JlZ29yaWFuTGVhcFllYXIoeWVhcikpIHtcbiAgICBkYXlzWzFdKys7XG4gIH1cbiAgcmV0dXJuIGRheXNbbW9udGggLSAxXTtcbn1cblxuZnVuY3Rpb24gZ2V0SGVicmV3TW9udGhzKHllYXI6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBpc0hlYnJld0xlYXBZZWFyKHllYXIpID8gMTMgOiAxMjtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZGF5cyBpbiBhIHNwZWNpZmljIEhlYnJldyB5ZWFyLlxuICogYHllYXJgIGlzIGFueSBIZWJyZXcgeWVhci5cbiAqL1xuZnVuY3Rpb24gZ2V0RGF5c0luSGVicmV3WWVhcih5ZWFyOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gbnVtYmVyT2ZGaXJzdERheUluWWVhcih5ZWFyICsgMSkgLSBudW1iZXJPZkZpcnN0RGF5SW5ZZWFyKHllYXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNIZWJyZXdMZWFwWWVhcih5ZWFyOiBudW1iZXIpOiBib29sZWFuIHtcbiAgbGV0IGIgPSAoeWVhciAqIDEyICsgMTcpICUgMTk7XG4gIHJldHVybiBiID49ICgoYiA8IDApID8gLTcgOiAxMik7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGRheXMgaW4gYSBzcGVjaWZpYyBIZWJyZXcgbW9udGguXG4gKiBgbW9udGhgIGlzIDEgZm9yIE5pc2FuLCAyIGZvciBJeWFyIGV0Yy4gTm90ZTogSGVicmV3IGxlYXAgeWVhciBjb250YWlucyAxMyBtb250aHMuXG4gKiBgeWVhcmAgaXMgYW55IEhlYnJldyB5ZWFyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF5c0luSGVicmV3TW9udGgobW9udGg6IG51bWJlciwgeWVhcjogbnVtYmVyKTogbnVtYmVyIHtcbiAgbGV0IHllYXJMZW5ndGggPSBudW1iZXJPZkZpcnN0RGF5SW5ZZWFyKHllYXIgKyAxKSAtIG51bWJlck9mRmlyc3REYXlJblllYXIoeWVhcik7XG4gIGxldCB5ZWFyVHlwZSA9ICh5ZWFyTGVuZ3RoIDw9IDM4MCA/IHllYXJMZW5ndGggOiAoeWVhckxlbmd0aCAtIDMwKSkgLSAzNTM7XG4gIGxldCBsZWFwWWVhciA9IGlzSGVicmV3TGVhcFllYXIoeWVhcik7XG4gIGxldCBkYXlzSW5Nb250aCA9IGxlYXBZZWFyID8gWzMwLCAyOSwgMjksIDI5LCAzMCwgMzAsIDI5LCAzMCwgMjksIDMwLCAyOSwgMzAsIDI5XSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWzMwLCAyOSwgMjksIDI5LCAzMCwgMjksIDMwLCAyOSwgMzAsIDI5LCAzMCwgMjldO1xuICBpZiAoeWVhclR5cGUgPiAwKSB7XG4gICAgZGF5c0luTW9udGhbMl0rKzsgIC8vIEtpc2xldiBnZXRzIGFuIGV4dHJhIGRheSBpbiBub3JtYWwgb3IgY29tcGxldGUgeWVhcnMuXG4gIH1cbiAgaWYgKHllYXJUeXBlID4gMSkge1xuICAgIGRheXNJbk1vbnRoWzFdKys7ICAvLyBIZXNodmFuIGdldHMgYW4gZXh0cmEgZGF5IGluIGNvbXBsZXRlIHllYXJzIG9ubHkuXG4gIH1cbiAgcmV0dXJuIGRheXNJbk1vbnRoW21vbnRoIC0gMV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREYXlOdW1iZXJJbkhlYnJld1llYXIoZGF0ZTogTmdiRGF0ZSk6IG51bWJlciB7XG4gIGxldCBudW1iZXJPZkRheSA9IDA7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgZGF0ZS5tb250aDsgaSsrKSB7XG4gICAgbnVtYmVyT2ZEYXkgKz0gZ2V0RGF5c0luSGVicmV3TW9udGgoaSwgZGF0ZS55ZWFyKTtcbiAgfVxuICByZXR1cm4gbnVtYmVyT2ZEYXkgKyBkYXRlLmRheTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEhlYnJld01vbnRoKGRhdGU6IE5nYkRhdGUsIHZhbDogbnVtYmVyKTogTmdiRGF0ZSB7XG4gIGxldCBhZnRlciA9IHZhbCA+PSAwO1xuICBpZiAoIWFmdGVyKSB7XG4gICAgdmFsID0gLXZhbDtcbiAgfVxuICB3aGlsZSAodmFsID4gMCkge1xuICAgIGlmIChhZnRlcikge1xuICAgICAgaWYgKHZhbCA+IGdldEhlYnJld01vbnRocyhkYXRlLnllYXIpIC0gZGF0ZS5tb250aCkge1xuICAgICAgICB2YWwgLT0gZ2V0SGVicmV3TW9udGhzKGRhdGUueWVhcikgLSBkYXRlLm1vbnRoICsgMTtcbiAgICAgICAgZGF0ZS55ZWFyKys7XG4gICAgICAgIGRhdGUubW9udGggPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0ZS5tb250aCArPSB2YWw7XG4gICAgICAgIHZhbCA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2YWwgPj0gZGF0ZS5tb250aCkge1xuICAgICAgICBkYXRlLnllYXItLTtcbiAgICAgICAgdmFsIC09IGRhdGUubW9udGg7XG4gICAgICAgIGRhdGUubW9udGggPSBnZXRIZWJyZXdNb250aHMoZGF0ZS55ZWFyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGUubW9udGggLT0gdmFsO1xuICAgICAgICB2YWwgPSAwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGF0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEhlYnJld0RheShkYXRlOiBOZ2JEYXRlLCB2YWw6IG51bWJlcik6IE5nYkRhdGUge1xuICBsZXQgYWZ0ZXIgPSB2YWwgPj0gMDtcbiAgaWYgKCFhZnRlcikge1xuICAgIHZhbCA9IC12YWw7XG4gIH1cbiAgd2hpbGUgKHZhbCA+IDApIHtcbiAgICBpZiAoYWZ0ZXIpIHtcbiAgICAgIGlmICh2YWwgPiBnZXREYXlzSW5IZWJyZXdZZWFyKGRhdGUueWVhcikgLSBnZXREYXlOdW1iZXJJbkhlYnJld1llYXIoZGF0ZSkpIHtcbiAgICAgICAgdmFsIC09IGdldERheXNJbkhlYnJld1llYXIoZGF0ZS55ZWFyKSAtIGdldERheU51bWJlckluSGVicmV3WWVhcihkYXRlKSArIDE7XG4gICAgICAgIGRhdGUueWVhcisrO1xuICAgICAgICBkYXRlLm1vbnRoID0gMTtcbiAgICAgICAgZGF0ZS5kYXkgPSAxO1xuICAgICAgfSBlbHNlIGlmICh2YWwgPiBnZXREYXlzSW5IZWJyZXdNb250aChkYXRlLm1vbnRoLCBkYXRlLnllYXIpIC0gZGF0ZS5kYXkpIHtcbiAgICAgICAgdmFsIC09IGdldERheXNJbkhlYnJld01vbnRoKGRhdGUubW9udGgsIGRhdGUueWVhcikgLSBkYXRlLmRheSArIDE7XG4gICAgICAgIGRhdGUubW9udGgrKztcbiAgICAgICAgZGF0ZS5kYXkgPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0ZS5kYXkgKz0gdmFsO1xuICAgICAgICB2YWwgPSAwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmFsID49IGRhdGUuZGF5KSB7XG4gICAgICAgIHZhbCAtPSBkYXRlLmRheTtcbiAgICAgICAgZGF0ZS5tb250aC0tO1xuICAgICAgICBpZiAoZGF0ZS5tb250aCA9PT0gMCkge1xuICAgICAgICAgIGRhdGUueWVhci0tO1xuICAgICAgICAgIGRhdGUubW9udGggPSBnZXRIZWJyZXdNb250aHMoZGF0ZS55ZWFyKTtcbiAgICAgICAgfVxuICAgICAgICBkYXRlLmRheSA9IGdldERheXNJbkhlYnJld01vbnRoKGRhdGUubW9udGgsIGRhdGUueWVhcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXRlLmRheSAtPSB2YWw7XG4gICAgICAgIHZhbCA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBkYXRlO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGVxdWl2YWxlbnQgSGVicmV3IGRhdGUgdmFsdWUgZm9yIGEgZ2l2ZSBpbnB1dCBHcmVnb3JpYW4gZGF0ZS5cbiAqIGBnZGF0ZWAgaXMgYSBKUyBEYXRlIHRvIGJlIGNvbnZlcnRlZCB0byBIZWJyZXcgZGF0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21HcmVnb3JpYW4oZ2RhdGU6IERhdGUpOiBOZ2JEYXRlIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGdkYXRlKTtcbiAgY29uc3QgZ1llYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCksIGdNb250aCA9IGRhdGUuZ2V0TW9udGgoKSwgZ0RheSA9IGRhdGUuZ2V0RGF0ZSgpO1xuICBsZXQganVsaWFuRGF5ID0gR1JFR09SSUFOX0VQT0NIIC0gMSArIDM2NSAqIChnWWVhciAtIDEpICsgTWF0aC5mbG9vcigoZ1llYXIgLSAxKSAvIDQpIC1cbiAgICAgIE1hdGguZmxvb3IoKGdZZWFyIC0gMSkgLyAxMDApICsgTWF0aC5mbG9vcigoZ1llYXIgLSAxKSAvIDQwMCkgK1xuICAgICAgTWF0aC5mbG9vcigoMzY3ICogKGdNb250aCArIDEpIC0gMzYyKSAvIDEyICsgKGdNb250aCArIDEgPD0gMiA/IDAgOiBpc0dyZWdvcmlhbkxlYXBZZWFyKGdZZWFyKSA/IC0xIDogLTIpICsgZ0RheSk7XG4gIGp1bGlhbkRheSA9IE1hdGguZmxvb3IoanVsaWFuRGF5ICsgMC41KTtcbiAgbGV0IGRheXNTaW5jZUhlYkVwb2NoID0ganVsaWFuRGF5IC0gMzQ3OTk3O1xuICBsZXQgbW9udGhzU2luY2VIZWJFcG9jaCA9IE1hdGguZmxvb3IoZGF5c1NpbmNlSGViRXBvY2ggKiBQQVJUU19QRVJfREFZIC8gUEFSVFNfUEVSX01PTlRIKTtcbiAgbGV0IGhZZWFyID0gTWF0aC5mbG9vcigobW9udGhzU2luY2VIZWJFcG9jaCAqIDE5ICsgMjM0KSAvIDIzNSkgKyAxO1xuICBsZXQgZmlyc3REYXlPZlRoaXNZZWFyID0gbnVtYmVyT2ZGaXJzdERheUluWWVhcihoWWVhcik7XG4gIGxldCBkYXlPZlllYXIgPSBkYXlzU2luY2VIZWJFcG9jaCAtIGZpcnN0RGF5T2ZUaGlzWWVhcjtcbiAgd2hpbGUgKGRheU9mWWVhciA8IDEpIHtcbiAgICBoWWVhci0tO1xuICAgIGZpcnN0RGF5T2ZUaGlzWWVhciA9IG51bWJlck9mRmlyc3REYXlJblllYXIoaFllYXIpO1xuICAgIGRheU9mWWVhciA9IGRheXNTaW5jZUhlYkVwb2NoIC0gZmlyc3REYXlPZlRoaXNZZWFyO1xuICB9XG4gIGxldCBoTW9udGggPSAxO1xuICBsZXQgaERheSA9IGRheU9mWWVhcjtcbiAgd2hpbGUgKGhEYXkgPiBnZXREYXlzSW5IZWJyZXdNb250aChoTW9udGgsIGhZZWFyKSkge1xuICAgIGhEYXkgLT0gZ2V0RGF5c0luSGVicmV3TW9udGgoaE1vbnRoLCBoWWVhcik7XG4gICAgaE1vbnRoKys7XG4gIH1cbiAgcmV0dXJuIG5ldyBOZ2JEYXRlKGhZZWFyLCBoTW9udGgsIGhEYXkpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGVxdWl2YWxlbnQgSlMgZGF0ZSB2YWx1ZSBmb3IgYSBnaXZlbiBIZWJyZXcgZGF0ZS5cbiAqIGBoZWJyZXdEYXRlYCBpcyBhbiBIZWJyZXcgZGF0ZSB0byBiZSBjb252ZXJ0ZWQgdG8gR3JlZ29yaWFuLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9HcmVnb3JpYW4oaGVicmV3RGF0ZTogTmdiRGF0ZVN0cnVjdCB8IE5nYkRhdGUpOiBEYXRlIHtcbiAgY29uc3QgaFllYXIgPSBoZWJyZXdEYXRlLnllYXI7XG4gIGNvbnN0IGhNb250aCA9IGhlYnJld0RhdGUubW9udGg7XG4gIGNvbnN0IGhEYXkgPSBoZWJyZXdEYXRlLmRheTtcbiAgbGV0IGRheXMgPSBudW1iZXJPZkZpcnN0RGF5SW5ZZWFyKGhZZWFyKTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBoTW9udGg7IGkrKykge1xuICAgIGRheXMgKz0gZ2V0RGF5c0luSGVicmV3TW9udGgoaSwgaFllYXIpO1xuICB9XG4gIGRheXMgKz0gaERheTtcbiAgbGV0IGRpZmZEYXlzID0gZGF5cyAtIEhFQlJFV19EQVlfT05fSkFOXzFfMTk3MDtcbiAgbGV0IGFmdGVyID0gZGlmZkRheXMgPj0gMDtcbiAgaWYgKCFhZnRlcikge1xuICAgIGRpZmZEYXlzID0gLWRpZmZEYXlzO1xuICB9XG4gIGxldCBnWWVhciA9IDE5NzA7XG4gIGxldCBnTW9udGggPSAxO1xuICBsZXQgZ0RheSA9IDE7XG4gIHdoaWxlIChkaWZmRGF5cyA+IDApIHtcbiAgICBpZiAoYWZ0ZXIpIHtcbiAgICAgIGlmIChkaWZmRGF5cyA+PSAoaXNHcmVnb3JpYW5MZWFwWWVhcihnWWVhcikgPyAzNjYgOiAzNjUpKSB7XG4gICAgICAgIGRpZmZEYXlzIC09IGlzR3JlZ29yaWFuTGVhcFllYXIoZ1llYXIpID8gMzY2IDogMzY1O1xuICAgICAgICBnWWVhcisrO1xuICAgICAgfSBlbHNlIGlmIChkaWZmRGF5cyA+PSBnZXREYXlzSW5HcmVnb3JpYW5Nb250aChnTW9udGgsIGdZZWFyKSkge1xuICAgICAgICBkaWZmRGF5cyAtPSBnZXREYXlzSW5HcmVnb3JpYW5Nb250aChnTW9udGgsIGdZZWFyKTtcbiAgICAgICAgZ01vbnRoKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnRGF5ICs9IGRpZmZEYXlzO1xuICAgICAgICBkaWZmRGF5cyA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChkaWZmRGF5cyA+PSAoaXNHcmVnb3JpYW5MZWFwWWVhcihnWWVhciAtIDEpID8gMzY2IDogMzY1KSkge1xuICAgICAgICBkaWZmRGF5cyAtPSBpc0dyZWdvcmlhbkxlYXBZZWFyKGdZZWFyIC0gMSkgPyAzNjYgOiAzNjU7XG4gICAgICAgIGdZZWFyLS07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZ01vbnRoID4gMSkge1xuICAgICAgICAgIGdNb250aC0tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdNb250aCA9IDEyO1xuICAgICAgICAgIGdZZWFyLS07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpZmZEYXlzID49IGdldERheXNJbkdyZWdvcmlhbk1vbnRoKGdNb250aCwgZ1llYXIpKSB7XG4gICAgICAgICAgZGlmZkRheXMgLT0gZ2V0RGF5c0luR3JlZ29yaWFuTW9udGgoZ01vbnRoLCBnWWVhcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ0RheSA9IGdldERheXNJbkdyZWdvcmlhbk1vbnRoKGdNb250aCwgZ1llYXIpIC0gZGlmZkRheXMgKyAxO1xuICAgICAgICAgIGRpZmZEYXlzID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IERhdGUoZ1llYXIsIGdNb250aCAtIDEsIGdEYXkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGVicmV3TnVtZXJhbHMobnVtZXJhbHM6IG51bWJlcik6IHN0cmluZyB7XG4gIGlmICghbnVtZXJhbHMpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgY29uc3QgaEFycmF5MF85ID0gWycnLCAnXFx1MDVkMCcsICdcXHUwNWQxJywgJ1xcdTA1ZDInLCAnXFx1MDVkMycsICdcXHUwNWQ0JywgJ1xcdTA1ZDUnLCAnXFx1MDVkNicsICdcXHUwNWQ3JywgJ1xcdTA1ZDgnXTtcbiAgY29uc3QgaEFycmF5MTBfMTkgPSBbXG4gICAgJ1xcdTA1ZDknLCAnXFx1MDVkOVxcdTA1ZDAnLCAnXFx1MDVkOVxcdTA1ZDEnLCAnXFx1MDVkOVxcdTA1ZDInLCAnXFx1MDVkOVxcdTA1ZDMnLCAnXFx1MDVkOFxcdTA1ZDUnLCAnXFx1MDVkOFxcdTA1ZDYnLFxuICAgICdcXHUwNWQ5XFx1MDVkNicsICdcXHUwNWQ5XFx1MDVkNycsICdcXHUwNWQ5XFx1MDVkOCdcbiAgXTtcbiAgY29uc3QgaEFycmF5MjBfOTAgPSBbJycsICcnLCAnXFx1MDVkYicsICdcXHUwNWRjJywgJ1xcdTA1ZGUnLCAnXFx1MDVlMCcsICdcXHUwNWUxJywgJ1xcdTA1ZTInLCAnXFx1MDVlNCcsICdcXHUwNWU2J107XG4gIGNvbnN0IGhBcnJheTEwMF85MDAgPSBbXG4gICAgJycsICdcXHUwNWU3JywgJ1xcdTA1ZTgnLCAnXFx1MDVlOScsICdcXHUwNWVhJywgJ1xcdTA1ZWFcXHUwNWU3JywgJ1xcdTA1ZWFcXHUwNWU4JywgJ1xcdTA1ZWFcXHUwNWU5JywgJ1xcdTA1ZWFcXHUwNWVhJyxcbiAgICAnXFx1MDVlYVxcdTA1ZWFcXHUwNWU3J1xuICBdO1xuICBjb25zdCBoQXJyYXkxMDAwXzkwMDAgPSBbXG4gICAgJycsICdcXHUwNWQwJywgJ1xcdTA1ZDEnLCAnXFx1MDVkMVxcdTA1ZDAnLCAnXFx1MDVkMVxcdTA1ZDEnLCAnXFx1MDVkNCcsICdcXHUwNWQ0XFx1MDVkMCcsICdcXHUwNWQ0XFx1MDVkMScsXG4gICAgJ1xcdTA1ZDRcXHUwNWQxXFx1MDVkMCcsICdcXHUwNWQ0XFx1MDVkMVxcdTA1ZDEnXG4gIF07XG4gIGNvbnN0IGdlcmVzaCA9ICdcXHUwNWYzJywgZ2Vyc2hhaW0gPSAnXFx1MDVmNCc7XG4gIGxldCBtZW0gPSAwO1xuICBsZXQgcmVzdWx0ID0gW107XG4gIGxldCBzdGVwID0gMDtcbiAgd2hpbGUgKG51bWVyYWxzID4gMCkge1xuICAgIGxldCBtID0gbnVtZXJhbHMgJSAxMDtcbiAgICBpZiAoc3RlcCA9PT0gMCkge1xuICAgICAgbWVtID0gbTtcbiAgICB9IGVsc2UgaWYgKHN0ZXAgPT09IDEpIHtcbiAgICAgIGlmIChtICE9PSAxKSB7XG4gICAgICAgIHJlc3VsdC51bnNoaWZ0KGhBcnJheTIwXzkwW21dLCBoQXJyYXkwXzlbbWVtXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQudW5zaGlmdChoQXJyYXkxMF8xOVttZW1dKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHN0ZXAgPT09IDIpIHtcbiAgICAgIHJlc3VsdC51bnNoaWZ0KGhBcnJheTEwMF85MDBbbV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobSAhPT0gNSkge1xuICAgICAgICByZXN1bHQudW5zaGlmdChoQXJyYXkxMDAwXzkwMDBbbV0sIGdlcmVzaCwgJyAnKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBudW1lcmFscyA9IE1hdGguZmxvb3IobnVtZXJhbHMgLyAxMCk7XG4gICAgaWYgKHN0ZXAgPT09IDAgJiYgbnVtZXJhbHMgPT09IDApIHtcbiAgICAgIHJlc3VsdC51bnNoaWZ0KGhBcnJheTBfOVttXSk7XG4gICAgfVxuICAgIHN0ZXArKztcbiAgfVxuICByZXN1bHQgPSByZXN1bHQuam9pbignJykuc3BsaXQoJycpO1xuICBpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJlc3VsdC5wdXNoKGdlcmVzaCk7XG4gIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDEpIHtcbiAgICByZXN1bHQuc3BsaWNlKHJlc3VsdC5sZW5ndGggLSAxLCAwLCBnZXJzaGFpbSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcbn1cbiIsImltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi4vbmdiLWRhdGUnO1xuaW1wb3J0IHtmcm9tSlNEYXRlLCBOZ2JDYWxlbmRhciwgTmdiUGVyaW9kLCB0b0pTRGF0ZX0gZnJvbSAnLi4vbmdiLWNhbGVuZGFyJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzTnVtYmVyfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtcbiAgZnJvbUdyZWdvcmlhbixcbiAgZ2V0RGF5TnVtYmVySW5IZWJyZXdZZWFyLFxuICBnZXREYXlzSW5IZWJyZXdNb250aCxcbiAgaXNIZWJyZXdMZWFwWWVhcixcbiAgdG9HcmVnb3JpYW4sXG4gIHNldEhlYnJld0RheSxcbiAgc2V0SGVicmV3TW9udGhcbn0gZnJvbSAnLi9oZWJyZXcnO1xuXG4vKipcbiAqIEBzaW5jZSAzLjIuMFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdiQ2FsZW5kYXJIZWJyZXcgZXh0ZW5kcyBOZ2JDYWxlbmRhciB7XG4gIGdldERheXNQZXJXZWVrKCkgeyByZXR1cm4gNzsgfVxuXG4gIGdldE1vbnRocyh5ZWFyPzogbnVtYmVyKSB7XG4gICAgaWYgKHllYXIgJiYgaXNIZWJyZXdMZWFwWWVhcih5ZWFyKSkge1xuICAgICAgcmV0dXJuIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxM107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMl07XG4gICAgfVxuICB9XG5cbiAgZ2V0V2Vla3NQZXJNb250aCgpIHsgcmV0dXJuIDY7IH1cblxuICBpc1ZhbGlkKGRhdGU6IE5nYkRhdGUpOiBib29sZWFuIHtcbiAgICBsZXQgYiA9IGRhdGUgJiYgaXNOdW1iZXIoZGF0ZS55ZWFyKSAmJiBpc051bWJlcihkYXRlLm1vbnRoKSAmJiBpc051bWJlcihkYXRlLmRheSk7XG4gICAgYiA9IGIgJiYgZGF0ZS5tb250aCA+IDAgJiYgZGF0ZS5tb250aCA8PSAoaXNIZWJyZXdMZWFwWWVhcihkYXRlLnllYXIpID8gMTMgOiAxMik7XG4gICAgYiA9IGIgJiYgZGF0ZS5kYXkgPiAwICYmIGRhdGUuZGF5IDw9IGdldERheXNJbkhlYnJld01vbnRoKGRhdGUubW9udGgsIGRhdGUueWVhcik7XG4gICAgcmV0dXJuIGIgJiYgIWlzTmFOKHRvR3JlZ29yaWFuKGRhdGUpLmdldFRpbWUoKSk7XG4gIH1cblxuICBnZXROZXh0KGRhdGU6IE5nYkRhdGUsIHBlcmlvZDogTmdiUGVyaW9kID0gJ2QnLCBudW1iZXIgPSAxKSB7XG4gICAgZGF0ZSA9IG5ldyBOZ2JEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCwgZGF0ZS5kYXkpO1xuXG4gICAgc3dpdGNoIChwZXJpb2QpIHtcbiAgICAgIGNhc2UgJ3knOlxuICAgICAgICBkYXRlLnllYXIgKz0gbnVtYmVyO1xuICAgICAgICBkYXRlLm1vbnRoID0gMTtcbiAgICAgICAgZGF0ZS5kYXkgPSAxO1xuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgIGNhc2UgJ20nOlxuICAgICAgICBkYXRlID0gc2V0SGVicmV3TW9udGgoZGF0ZSwgbnVtYmVyKTtcbiAgICAgICAgZGF0ZS5kYXkgPSAxO1xuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgIGNhc2UgJ2QnOlxuICAgICAgICByZXR1cm4gc2V0SGVicmV3RGF5KGRhdGUsIG51bWJlcik7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gIH1cblxuICBnZXRQcmV2KGRhdGU6IE5nYkRhdGUsIHBlcmlvZDogTmdiUGVyaW9kID0gJ2QnLCBudW1iZXIgPSAxKSB7IHJldHVybiB0aGlzLmdldE5leHQoZGF0ZSwgcGVyaW9kLCAtbnVtYmVyKTsgfVxuXG4gIGdldFdlZWtkYXkoZGF0ZTogTmdiRGF0ZSkge1xuICAgIGNvbnN0IGRheSA9IHRvR3JlZ29yaWFuKGRhdGUpLmdldERheSgpO1xuICAgIC8vIGluIEpTIERhdGUgU3VuPTAsIGluIElTTyA4NjAxIFN1bj03XG4gICAgcmV0dXJuIGRheSA9PT0gMCA/IDcgOiBkYXk7XG4gIH1cblxuICBnZXRXZWVrTnVtYmVyKHdlZWs6IE5nYkRhdGVbXSwgZmlyc3REYXlPZldlZWs6IG51bWJlcikge1xuICAgIGNvbnN0IGRhdGUgPSB3ZWVrW3dlZWsubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIE1hdGguY2VpbChnZXREYXlOdW1iZXJJbkhlYnJld1llYXIoZGF0ZSkgLyA3KTtcbiAgfVxuXG4gIGdldFRvZGF5KCk6IE5nYkRhdGUgeyByZXR1cm4gZnJvbUdyZWdvcmlhbihuZXcgRGF0ZSgpKTsgfVxuXG4gIC8qKlxuICAgKiBAc2luY2UgMy40LjBcbiAgICovXG4gIHRvR3JlZ29yaWFuKGRhdGU6IE5nYkRhdGUpOiBOZ2JEYXRlIHsgcmV0dXJuIGZyb21KU0RhdGUodG9HcmVnb3JpYW4oZGF0ZSkpOyB9XG5cbiAgLyoqXG4gICAqIEBzaW5jZSAzLjQuMFxuICAgKi9cbiAgZnJvbUdyZWdvcmlhbihkYXRlOiBOZ2JEYXRlKTogTmdiRGF0ZSB7IHJldHVybiBmcm9tR3JlZ29yaWFuKHRvSlNEYXRlKGRhdGUpKTsgfVxufVxuIiwiaW1wb3J0IHtOZ2JEYXRlcGlja2VySTE4bn0gZnJvbSAnLi4vZGF0ZXBpY2tlci1pMThuJztcbmltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi4vLi4vaW5kZXgnO1xuaW1wb3J0IHtoZWJyZXdOdW1lcmFscywgaXNIZWJyZXdMZWFwWWVhcn0gZnJvbSAnLi9oZWJyZXcnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuXG5jb25zdCBXRUVLREFZUyA9IFsnw5fCqcOXwqDDl8KZJywgJ8OXwqnDl8Kcw5fCmcOXwqnDl8KZJywgJ8OXwqjDl8KRw5fCmcOXwqLDl8KZJywgJ8OXwpfDl8Kew5fCmcOXwqnDl8KZJywgJ8OXwqnDl8KZw5fCqcOXwpknLCAnw5fCqcOXwpHDl8KqJywgJ8OXwqjDl8KQw5fCqcOXwpXDl8KfJ107XG5jb25zdCBNT05USFMgPSBbJ8OXwqrDl8Kpw5fCqMOXwpknLCAnw5fCl8OXwqnDl8KVw5fCnycsICfDl8Kbw5fCocOXwpzDl8KVJywgJ8OXwpjDl8KRw5fCqicsICfDl8Kpw5fCkcOXwpgnLCAnw5fCkMOXwpPDl8KoJywgJ8OXwqDDl8KZw5fCocOXwp8nLCAnw5fCkMOXwpnDl8KZw5fCqCcsICfDl8Khw5fCmcOXwpXDl8KfJywgJ8OXwqrDl8Kew5fClcOXwpYnLCAnw5fCkMOXwpEnLCAnw5fCkMOXwpzDl8KVw5fCnCddO1xuY29uc3QgTU9OVEhTX0xFQVAgPVxuICAgIFsnw5fCqsOXwqnDl8Kow5fCmScsICfDl8KXw5fCqcOXwpXDl8KfJywgJ8OXwpvDl8Khw5fCnMOXwpUnLCAnw5fCmMOXwpHDl8KqJywgJ8OXwqnDl8KRw5fCmCcsICfDl8KQw5fCk8OXwqggw5fCkMOXwrMnLCAnw5fCkMOXwpPDl8KoIMOXwpHDl8KzJywgJ8OXwqDDl8KZw5fCocOXwp8nLCAnw5fCkMOXwpnDl8KZw5fCqCcsICfDl8Khw5fCmcOXwpXDl8KfJywgJ8OXwqrDl8Kew5fClcOXwpYnLCAnw5fCkMOXwpEnLCAnw5fCkMOXwpzDl8KVw5fCnCddO1xuXG4vKipcbiAqIEBzaW5jZSAzLjIuMFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlckkxOG5IZWJyZXcgZXh0ZW5kcyBOZ2JEYXRlcGlja2VySTE4biB7XG4gIGdldE1vbnRoU2hvcnROYW1lKG1vbnRoOiBudW1iZXIsIHllYXI/OiBudW1iZXIpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5nZXRNb250aEZ1bGxOYW1lKG1vbnRoLCB5ZWFyKTsgfVxuXG4gIGdldE1vbnRoRnVsbE5hbWUobW9udGg6IG51bWJlciwgeWVhcj86IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGlzSGVicmV3TGVhcFllYXIoeWVhcikgPyBNT05USFNfTEVBUFttb250aCAtIDFdIDogTU9OVEhTW21vbnRoIC0gMV07XG4gIH1cblxuICBnZXRXZWVrZGF5U2hvcnROYW1lKHdlZWtkYXk6IG51bWJlcik6IHN0cmluZyB7IHJldHVybiBXRUVLREFZU1t3ZWVrZGF5IC0gMV07IH1cblxuICBnZXREYXlBcmlhTGFiZWwoZGF0ZTogTmdiRGF0ZVN0cnVjdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke2hlYnJld051bWVyYWxzKGRhdGUuZGF5KX0gJHt0aGlzLmdldE1vbnRoRnVsbE5hbWUoZGF0ZS5tb250aCwgZGF0ZS55ZWFyKX0gJHtoZWJyZXdOdW1lcmFscyhkYXRlLnllYXIpfWA7XG4gIH1cblxuICBnZXREYXlOdW1lcmFscyhkYXRlOiBOZ2JEYXRlU3RydWN0KTogc3RyaW5nIHsgcmV0dXJuIGhlYnJld051bWVyYWxzKGRhdGUuZGF5KTsgfVxuXG4gIGdldFdlZWtOdW1lcmFscyh3ZWVrTnVtYmVyOiBudW1iZXIpOiBzdHJpbmcgeyByZXR1cm4gaGVicmV3TnVtZXJhbHMod2Vla051bWJlcik7IH1cblxuICBnZXRZZWFyTnVtZXJhbHMoeWVhcjogbnVtYmVyKTogc3RyaW5nIHsgcmV0dXJuIGhlYnJld051bWVyYWxzKHllYXIpOyB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JEYXRlQWRhcHRlcn0gZnJvbSAnLi9uZ2ItZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi4vbmdiLWRhdGUtc3RydWN0JztcbmltcG9ydCB7aXNJbnRlZ2VyfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuXG4vKipcbiogTmdiRGF0ZUFkYXB0ZXIgaW1wbGVtZW50YXRpb24gdGhhdCBhbGxvd3MgdXNpbmcgbmF0aXZlIGphdmFzY3JpcHQgZGF0ZSBhcyBhIHVzZXIgZGF0ZSBtb2RlbC5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVOYXRpdmVBZGFwdGVyIGV4dGVuZHMgTmdiRGF0ZUFkYXB0ZXI8RGF0ZT4ge1xuICAvKipcbiAgICogQ29udmVydHMgbmF0aXZlIGRhdGUgdG8gYSBOZ2JEYXRlU3RydWN0XG4gICAqL1xuICBmcm9tTW9kZWwoZGF0ZTogRGF0ZSk6IE5nYkRhdGVTdHJ1Y3Qge1xuICAgIHJldHVybiAoZGF0ZSBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKGRhdGUuZ2V0VGltZSgpKSkgPyB0aGlzLl9mcm9tTmF0aXZlRGF0ZShkYXRlKSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBOZ2JEYXRlU3RydWN0IHRvIGEgbmF0aXZlIGRhdGVcbiAgICovXG4gIHRvTW9kZWwoZGF0ZTogTmdiRGF0ZVN0cnVjdCk6IERhdGUge1xuICAgIHJldHVybiBkYXRlICYmIGlzSW50ZWdlcihkYXRlLnllYXIpICYmIGlzSW50ZWdlcihkYXRlLm1vbnRoKSAmJiBpc0ludGVnZXIoZGF0ZS5kYXkpID8gdGhpcy5fdG9OYXRpdmVEYXRlKGRhdGUpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGw7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Zyb21OYXRpdmVEYXRlKGRhdGU6IERhdGUpOiBOZ2JEYXRlU3RydWN0IHtcbiAgICByZXR1cm4ge3llYXI6IGRhdGUuZ2V0RnVsbFllYXIoKSwgbW9udGg6IGRhdGUuZ2V0TW9udGgoKSArIDEsIGRheTogZGF0ZS5nZXREYXRlKCl9O1xuICB9XG5cbiAgcHJvdGVjdGVkIF90b05hdGl2ZURhdGUoZGF0ZTogTmdiRGF0ZVN0cnVjdCk6IERhdGUge1xuICAgIGNvbnN0IGpzRGF0ZSA9IG5ldyBEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCAtIDEsIGRhdGUuZGF5LCAxMik7XG4gICAgLy8gYXZvaWQgMzAgLT4gMTkzMCBjb252ZXJzaW9uXG4gICAganNEYXRlLnNldEZ1bGxZZWFyKGRhdGUueWVhcik7XG4gICAgcmV0dXJuIGpzRGF0ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi4vbmdiLWRhdGUtc3RydWN0JztcbmltcG9ydCB7TmdiRGF0ZU5hdGl2ZUFkYXB0ZXJ9IGZyb20gJy4vbmdiLWRhdGUtbmF0aXZlLWFkYXB0ZXInO1xuXG4vKipcbiAqIE5nYkRhdGVBZGFwdGVyIGltcGxlbWVudGF0aW9uIHRoYXQgYWxsb3dzIHVzaW5nIG5hdGl2ZSBqYXZhc2NyaXB0IFVUQyBkYXRlIGFzIGEgdXNlciBkYXRlIG1vZGVsLlxuICogU2FtZSBhcyBOZ2JEYXRlTmF0aXZlQWRhcHRlciwgYnV0IHVzZXMgVVRDIGRhdGVzLlxuICpcbiAqIEBzaW5jZSAzLjIuMFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdiRGF0ZU5hdGl2ZVVUQ0FkYXB0ZXIgZXh0ZW5kcyBOZ2JEYXRlTmF0aXZlQWRhcHRlciB7XG4gIHByb3RlY3RlZCBfZnJvbU5hdGl2ZURhdGUoZGF0ZTogRGF0ZSk6IE5nYkRhdGVTdHJ1Y3Qge1xuICAgIHJldHVybiB7eWVhcjogZGF0ZS5nZXRVVENGdWxsWWVhcigpLCBtb250aDogZGF0ZS5nZXRVVENNb250aCgpICsgMSwgZGF5OiBkYXRlLmdldFVUQ0RhdGUoKX07XG4gIH1cblxuICBwcm90ZWN0ZWQgX3RvTmF0aXZlRGF0ZShkYXRlOiBOZ2JEYXRlU3RydWN0KTogRGF0ZSB7XG4gICAgY29uc3QganNEYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZS55ZWFyLCBkYXRlLm1vbnRoIC0gMSwgZGF0ZS5kYXkpKTtcbiAgICAvLyBhdm9pZCAzMCAtPiAxOTMwIGNvbnZlcnNpb25cbiAgICBqc0RhdGUuc2V0VVRDRnVsbFllYXIoZGF0ZS55ZWFyKTtcbiAgICByZXR1cm4ganNEYXRlO1xuICB9XG59XG4iLCJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtGb3Jtc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyfSBmcm9tICcuL2RhdGVwaWNrZXInO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyTW9udGhWaWV3fSBmcm9tICcuL2RhdGVwaWNrZXItbW9udGgtdmlldyc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJOYXZpZ2F0aW9ufSBmcm9tICcuL2RhdGVwaWNrZXItbmF2aWdhdGlvbic7XG5pbXBvcnQge05nYklucHV0RGF0ZXBpY2tlcn0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0JztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlckRheVZpZXd9IGZyb20gJy4vZGF0ZXBpY2tlci1kYXktdmlldyc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJOYXZpZ2F0aW9uU2VsZWN0fSBmcm9tICcuL2RhdGVwaWNrZXItbmF2aWdhdGlvbi1zZWxlY3QnO1xuXG5leHBvcnQge05nYkRhdGVwaWNrZXIsIE5nYkRhdGVwaWNrZXJOYXZpZ2F0ZUV2ZW50fSBmcm9tICcuL2RhdGVwaWNrZXInO1xuZXhwb3J0IHtOZ2JJbnB1dERhdGVwaWNrZXJ9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dCc7XG5leHBvcnQge05nYkNhbGVuZGFyLCBOZ2JQZXJpb2R9IGZyb20gJy4vbmdiLWNhbGVuZGFyJztcbmV4cG9ydCB7TmdiQ2FsZW5kYXJJc2xhbWljQ2l2aWx9IGZyb20gJy4vaGlqcmkvbmdiLWNhbGVuZGFyLWlzbGFtaWMtY2l2aWwnO1xuZXhwb3J0IHtOZ2JDYWxlbmRhcklzbGFtaWNVbWFscXVyYX0gZnJvbSAnLi9oaWpyaS9uZ2ItY2FsZW5kYXItaXNsYW1pYy11bWFscXVyYSc7XG5leHBvcnQge05nYkNhbGVuZGFyUGVyc2lhbn0gZnJvbSAnLi9qYWxhbGkvbmdiLWNhbGVuZGFyLXBlcnNpYW4nO1xuZXhwb3J0IHtOZ2JDYWxlbmRhckhlYnJld30gZnJvbSAnLi9oZWJyZXcvbmdiLWNhbGVuZGFyLWhlYnJldyc7XG5leHBvcnQge05nYkRhdGVwaWNrZXJJMThuSGVicmV3fSBmcm9tICcuL2hlYnJldy9kYXRlcGlja2VyLWkxOG4taGVicmV3JztcbmV4cG9ydCB7TmdiRGF0ZXBpY2tlck1vbnRoVmlld30gZnJvbSAnLi9kYXRlcGlja2VyLW1vbnRoLXZpZXcnO1xuZXhwb3J0IHtOZ2JEYXRlcGlja2VyRGF5Vmlld30gZnJvbSAnLi9kYXRlcGlja2VyLWRheS12aWV3JztcbmV4cG9ydCB7TmdiRGF0ZXBpY2tlck5hdmlnYXRpb259IGZyb20gJy4vZGF0ZXBpY2tlci1uYXZpZ2F0aW9uJztcbmV4cG9ydCB7TmdiRGF0ZXBpY2tlck5hdmlnYXRpb25TZWxlY3R9IGZyb20gJy4vZGF0ZXBpY2tlci1uYXZpZ2F0aW9uLXNlbGVjdCc7XG5leHBvcnQge05nYkRhdGVwaWNrZXJDb25maWd9IGZyb20gJy4vZGF0ZXBpY2tlci1jb25maWcnO1xuZXhwb3J0IHtOZ2JEYXRlcGlja2VySTE4bn0gZnJvbSAnLi9kYXRlcGlja2VyLWkxOG4nO1xuZXhwb3J0IHtOZ2JEYXRlU3RydWN0fSBmcm9tICcuL25nYi1kYXRlLXN0cnVjdCc7XG5leHBvcnQge05nYkRhdGV9IGZyb20gJy4vbmdiLWRhdGUnO1xuZXhwb3J0IHtOZ2JEYXRlQWRhcHRlcn0gZnJvbSAnLi9hZGFwdGVycy9uZ2ItZGF0ZS1hZGFwdGVyJztcbmV4cG9ydCB7TmdiRGF0ZU5hdGl2ZUFkYXB0ZXJ9IGZyb20gJy4vYWRhcHRlcnMvbmdiLWRhdGUtbmF0aXZlLWFkYXB0ZXInO1xuZXhwb3J0IHtOZ2JEYXRlTmF0aXZlVVRDQWRhcHRlcn0gZnJvbSAnLi9hZGFwdGVycy9uZ2ItZGF0ZS1uYXRpdmUtdXRjLWFkYXB0ZXInO1xuZXhwb3J0IHtOZ2JEYXRlUGFyc2VyRm9ybWF0dGVyfSBmcm9tICcuL25nYi1kYXRlLXBhcnNlci1mb3JtYXR0ZXInO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBOZ2JEYXRlcGlja2VyLCBOZ2JEYXRlcGlja2VyTW9udGhWaWV3LCBOZ2JEYXRlcGlja2VyTmF2aWdhdGlvbiwgTmdiRGF0ZXBpY2tlck5hdmlnYXRpb25TZWxlY3QsIE5nYkRhdGVwaWNrZXJEYXlWaWV3LFxuICAgIE5nYklucHV0RGF0ZXBpY2tlclxuICBdLFxuICBleHBvcnRzOiBbTmdiRGF0ZXBpY2tlciwgTmdiSW5wdXREYXRlcGlja2VyXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGVdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtOZ2JEYXRlcGlja2VyXVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyTW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYkRhdGVwaWNrZXJNb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbGFjZW1lbnRBcnJheX0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBzZXJ2aWNlIGZvciB0aGUgTmdiRHJvcGRvd24gZGlyZWN0aXZlLlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIGRyb3Bkb3ducyB1c2VkIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiRHJvcGRvd25Db25maWcge1xuICBhdXRvQ2xvc2U6IGJvb2xlYW4gfCAnb3V0c2lkZScgfCAnaW5zaWRlJyA9IHRydWU7XG4gIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXkgPSAnYm90dG9tLWxlZnQnO1xufVxuIiwiaW1wb3J0IHtcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBEaXJlY3RpdmUsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgRWxlbWVudFJlZixcbiAgQ29udGVudENoaWxkLFxuICBOZ1pvbmUsXG4gIFJlbmRlcmVyMixcbiAgT25Jbml0LFxuICBPbkRlc3Ryb3ksXG4gIENoYW5nZURldGVjdG9yUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7ZnJvbUV2ZW50LCByYWNlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtOZ2JEcm9wZG93bkNvbmZpZ30gZnJvbSAnLi9kcm9wZG93bi1jb25maWcnO1xuaW1wb3J0IHtwb3NpdGlvbkVsZW1lbnRzLCBQbGFjZW1lbnRBcnJheSwgUGxhY2VtZW50fSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcbmltcG9ydCB7S2V5fSBmcm9tICcuLi91dGlsL2tleSc7XG5cbi8qKlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdiRHJvcGRvd25NZW51XScsXG4gIGhvc3Q6IHsnW2NsYXNzLmRyb3Bkb3duLW1lbnVdJzogJ3RydWUnLCAnW2NsYXNzLnNob3ddJzogJ2Ryb3Bkb3duLmlzT3BlbigpJywgJ1thdHRyLngtcGxhY2VtZW50XSc6ICdwbGFjZW1lbnQnfVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93bk1lbnUge1xuICBwbGFjZW1lbnQ6IFBsYWNlbWVudCA9ICdib3R0b20nO1xuICBpc09wZW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBOZ2JEcm9wZG93bikpIHB1YmxpYyBkcm9wZG93biwgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxuXG4gIGlzRXZlbnRGcm9tKCRldmVudCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKCRldmVudC50YXJnZXQpOyB9XG5cbiAgcG9zaXRpb24odHJpZ2dlckVsLCBwbGFjZW1lbnQpIHtcbiAgICB0aGlzLmFwcGx5UGxhY2VtZW50KHBvc2l0aW9uRWxlbWVudHModHJpZ2dlckVsLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHBsYWNlbWVudCkpO1xuICB9XG5cbiAgYXBwbHlQbGFjZW1lbnQoX3BsYWNlbWVudDogUGxhY2VtZW50KSB7XG4gICAgLy8gcmVtb3ZlIHRoZSBjdXJyZW50IHBsYWNlbWVudCBjbGFzc2VzXG4gICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudE5vZGUsICdkcm9wdXAnKTtcbiAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZSwgJ2Ryb3Bkb3duJyk7XG4gICAgdGhpcy5wbGFjZW1lbnQgPSBfcGxhY2VtZW50O1xuICAgIC8qKlxuICAgICAqIGFwcGx5IHRoZSBuZXcgcGxhY2VtZW50XG4gICAgICogaW4gY2FzZSBvZiB0b3AgdXNlIHVwLWFycm93IG9yIGRvd24tYXJyb3cgb3RoZXJ3aXNlXG4gICAgICovXG4gICAgaWYgKF9wbGFjZW1lbnQuc2VhcmNoKCdedG9wJykgIT09IC0xKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZSwgJ2Ryb3B1cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZSwgJ2Ryb3Bkb3duJyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTWFya3MgYW4gZWxlbWVudCB0byB3aGljaCBkcm9wZG93biBtZW51IHdpbGwgYmUgYW5jaG9yZWQuIFRoaXMgaXMgYSBzaW1wbGUgdmVyc2lvblxuICogb2YgdGhlIE5nYkRyb3Bkb3duVG9nZ2xlIGRpcmVjdGl2ZS4gSXQgcGxheXMgdGhlIHNhbWUgcm9sZSBhcyBOZ2JEcm9wZG93blRvZ2dsZSBidXRcbiAqIGRvZXNuJ3QgbGlzdGVuIHRvIGNsaWNrIGV2ZW50cyB0byB0b2dnbGUgZHJvcGRvd24gbWVudSB0aHVzIGVuYWJsaW5nIHN1cHBvcnQgZm9yXG4gKiBldmVudHMgb3RoZXIgdGhhbiBjbGljay5cbiAqXG4gKiBAc2luY2UgMS4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duQW5jaG9yXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnZHJvcGRvd24tdG9nZ2xlJywgJ2FyaWEtaGFzcG9wdXAnOiAndHJ1ZScsICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdkcm9wZG93bi5pc09wZW4oKSd9XG59KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duQW5jaG9yIHtcbiAgYW5jaG9yRWw7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE5nYkRyb3Bkb3duKSkgcHVibGljIGRyb3Bkb3duLCBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIHRoaXMuYW5jaG9yRWwgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgaXNFdmVudEZyb20oJGV2ZW50KSB7IHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoJGV2ZW50LnRhcmdldCk7IH1cbn1cblxuLyoqXG4gKiBBbGxvd3MgdGhlIGRyb3Bkb3duIHRvIGJlIHRvZ2dsZWQgdmlhIGNsaWNrLiBUaGlzIGRpcmVjdGl2ZSBpcyBvcHRpb25hbDogeW91IGNhbiB1c2UgTmdiRHJvcGRvd25BbmNob3IgYXMgYW5cbiAqIGFsdGVybmF0aXZlLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdiRHJvcGRvd25Ub2dnbGVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdkcm9wZG93bi10b2dnbGUnLFxuICAgICdhcmlhLWhhc3BvcHVwJzogJ3RydWUnLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdkcm9wZG93bi5pc09wZW4oKScsXG4gICAgJyhjbGljayknOiAndG9nZ2xlT3BlbigpJ1xuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTmdiRHJvcGRvd25BbmNob3IsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYkRyb3Bkb3duVG9nZ2xlKX1dXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duVG9nZ2xlIGV4dGVuZHMgTmdiRHJvcGRvd25BbmNob3Ige1xuICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTmdiRHJvcGRvd24pKSBkcm9wZG93biwgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICBzdXBlcihkcm9wZG93biwgZWxlbWVudFJlZik7XG4gIH1cblxuICB0b2dnbGVPcGVuKCkgeyB0aGlzLmRyb3Bkb3duLnRvZ2dsZSgpOyB9XG59XG5cbi8qKlxuICogVHJhbnNmb3JtcyBhIG5vZGUgaW50byBhIGRyb3Bkb3duLlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tuZ2JEcm9wZG93bl0nLCBleHBvcnRBczogJ25nYkRyb3Bkb3duJywgaG9zdDogeydbY2xhc3Muc2hvd10nOiAnaXNPcGVuKCknfX0pXG5leHBvcnQgY2xhc3MgTmdiRHJvcGRvd24gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2Nsb3NlZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF96b25lU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgQENvbnRlbnRDaGlsZChOZ2JEcm9wZG93bk1lbnUpIHByaXZhdGUgX21lbnU6IE5nYkRyb3Bkb3duTWVudTtcblxuICBAQ29udGVudENoaWxkKE5nYkRyb3Bkb3duQW5jaG9yKSBwcml2YXRlIF9hbmNob3I6IE5nYkRyb3Bkb3duQW5jaG9yO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhhdCBkcm9wZG93biBzaG91bGQgYmUgY2xvc2VkIHdoZW4gc2VsZWN0aW5nIG9uZSBvZiBkcm9wZG93biBpdGVtcyAoY2xpY2spIG9yIHByZXNzaW5nIEVTQy5cbiAgICogV2hlbiBpdCBpcyB0cnVlIChkZWZhdWx0KSBkcm9wZG93bnMgYXJlIGF1dG9tYXRpY2FsbHkgY2xvc2VkIG9uIGJvdGggb3V0c2lkZSBhbmQgaW5zaWRlIChtZW51KSBjbGlja3MuXG4gICAqIFdoZW4gaXQgaXMgZmFsc2UgZHJvcGRvd25zIGFyZSBuZXZlciBhdXRvbWF0aWNhbGx5IGNsb3NlZC5cbiAgICogV2hlbiBpdCBpcyAnb3V0c2lkZScgZHJvcGRvd25zIGFyZSBhdXRvbWF0aWNhbGx5IGNsb3NlZCBvbiBvdXRzaWRlIGNsaWNrcyBidXQgbm90IG9uIG1lbnUgY2xpY2tzLlxuICAgKiBXaGVuIGl0IGlzICdpbnNpZGUnIGRyb3Bkb3ducyBhcmUgYXV0b21hdGljYWxseSBvbiBtZW51IGNsaWNrcyBidXQgbm90IG9uIG91dHNpZGUgY2xpY2tzLlxuICAgKi9cbiAgQElucHV0KCkgYXV0b0Nsb3NlOiBib29sZWFuIHwgJ291dHNpZGUnIHwgJ2luc2lkZSc7XG5cbiAgLyoqXG4gICAqICBEZWZpbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBkcm9wZG93bi1tZW51IGlzIG9wZW4gaW5pdGlhbGx5LlxuICAgKi9cbiAgQElucHV0KCdvcGVuJykgX29wZW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogUGxhY2VtZW50IG9mIGEgcG9wb3ZlciBhY2NlcHRzOlxuICAgKiAgICBcInRvcFwiLCBcInRvcC1sZWZ0XCIsIFwidG9wLXJpZ2h0XCIsIFwiYm90dG9tXCIsIFwiYm90dG9tLWxlZnRcIiwgXCJib3R0b20tcmlnaHRcIixcbiAgICogICAgXCJsZWZ0XCIsIFwibGVmdC10b3BcIiwgXCJsZWZ0LWJvdHRvbVwiLCBcInJpZ2h0XCIsIFwicmlnaHQtdG9wXCIsIFwicmlnaHQtYm90dG9tXCJcbiAgICogYW5kIGFycmF5IG9mIGFib3ZlIHZhbHVlcy5cbiAgICovXG4gIEBJbnB1dCgpIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXk7XG5cbiAgLyoqXG4gICAqICBBbiBldmVudCBmaXJlZCB3aGVuIHRoZSBkcm9wZG93biBpcyBvcGVuZWQgb3IgY2xvc2VkLlxuICAgKiAgRXZlbnQncyBwYXlsb2FkIGVxdWFscyB3aGV0aGVyIGRyb3Bkb3duIGlzIG9wZW4uXG4gICAqL1xuICBAT3V0cHV0KCkgb3BlbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZiwgY29uZmlnOiBOZ2JEcm9wZG93bkNvbmZpZywgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7XG4gICAgdGhpcy5wbGFjZW1lbnQgPSBjb25maWcucGxhY2VtZW50O1xuICAgIHRoaXMuYXV0b0Nsb3NlID0gY29uZmlnLmF1dG9DbG9zZTtcbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uID0gX25nWm9uZS5vblN0YWJsZS5zdWJzY3JpYmUoKCkgPT4geyB0aGlzLl9wb3NpdGlvbk1lbnUoKTsgfSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fbWVudSkge1xuICAgICAgdGhpcy5fbWVudS5hcHBseVBsYWNlbWVudChBcnJheS5pc0FycmF5KHRoaXMucGxhY2VtZW50KSA/ICh0aGlzLnBsYWNlbWVudFswXSkgOiB0aGlzLnBsYWNlbWVudCBhcyBQbGFjZW1lbnQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vcGVuKSB7XG4gICAgICB0aGlzLl9zZXRDbG9zZUhhbmRsZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZHJvcGRvd24gbWVudSBpcyBvcGVuIG9yIG5vdC5cbiAgICovXG4gIGlzT3BlbigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX29wZW47IH1cblxuICAvKipcbiAgICogT3BlbnMgdGhlIGRyb3Bkb3duIG1lbnUgb2YgYSBnaXZlbiBuYXZiYXIgb3IgdGFiYmVkIG5hdmlnYXRpb24uXG4gICAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fb3Blbikge1xuICAgICAgdGhpcy5fb3BlbiA9IHRydWU7XG4gICAgICB0aGlzLl9wb3NpdGlvbk1lbnUoKTtcbiAgICAgIHRoaXMub3BlbkNoYW5nZS5lbWl0KHRydWUpO1xuICAgICAgdGhpcy5fc2V0Q2xvc2VIYW5kbGVycygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NldENsb3NlSGFuZGxlcnMoKSB7XG4gICAgaWYgKHRoaXMuYXV0b0Nsb3NlKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBjb25zdCBlc2NhcGVzJCA9IGZyb21FdmVudDxLZXlib2FyZEV2ZW50Pih0aGlzLl9kb2N1bWVudCwgJ2tleXVwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWtlVW50aWwodGhpcy5fY2xvc2VkJCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGVwcmVjYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcihldmVudCA9PiBldmVudC53aGljaCA9PT0gS2V5LkVzY2FwZSkpO1xuXG4gICAgICAgIGNvbnN0IGNsaWNrcyQgPSBmcm9tRXZlbnQ8TW91c2VFdmVudD4odGhpcy5fZG9jdW1lbnQsICdjbGljaycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Nsb3NlZCQpLCBmaWx0ZXIoZXZlbnQgPT4gdGhpcy5fc2hvdWxkQ2xvc2VGcm9tQ2xpY2soZXZlbnQpKSk7XG5cbiAgICAgICAgcmFjZTxFdmVudD4oW2VzY2FwZXMkLCBjbGlja3MkXSkucGlwZSh0YWtlVW50aWwodGhpcy5fY2xvc2VkJCkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIGRyb3Bkb3duIG1lbnUgb2YgYSBnaXZlbiBuYXZiYXIgb3IgdGFiYmVkIG5hdmlnYXRpb24uXG4gICAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3Blbikge1xuICAgICAgdGhpcy5fb3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5fY2xvc2VkJC5uZXh0KCk7XG4gICAgICB0aGlzLm9wZW5DaGFuZ2UuZW1pdChmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIGRyb3Bkb3duIG1lbnUgb2YgYSBnaXZlbiBuYXZiYXIgb3IgdGFiYmVkIG5hdmlnYXRpb24uXG4gICAqL1xuICB0b2dnbGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2hvdWxkQ2xvc2VGcm9tQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuYnV0dG9uICE9PSAyICYmICF0aGlzLl9pc0V2ZW50RnJvbVRvZ2dsZShldmVudCkpIHtcbiAgICAgIGlmICh0aGlzLmF1dG9DbG9zZSA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hdXRvQ2xvc2UgPT09ICdpbnNpZGUnICYmIHRoaXMuX2lzRXZlbnRGcm9tTWVudShldmVudCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuYXV0b0Nsb3NlID09PSAnb3V0c2lkZScgJiYgIXRoaXMuX2lzRXZlbnRGcm9tTWVudShldmVudCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Nsb3NlZCQubmV4dCgpO1xuICAgIHRoaXMuX3pvbmVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2lzRXZlbnRGcm9tVG9nZ2xlKCRldmVudCkgeyByZXR1cm4gdGhpcy5fYW5jaG9yLmlzRXZlbnRGcm9tKCRldmVudCk7IH1cblxuICBwcml2YXRlIF9pc0V2ZW50RnJvbU1lbnUoJGV2ZW50KSB7IHJldHVybiB0aGlzLl9tZW51ID8gdGhpcy5fbWVudS5pc0V2ZW50RnJvbSgkZXZlbnQpIDogZmFsc2U7IH1cblxuICBwcml2YXRlIF9wb3NpdGlvbk1lbnUoKSB7XG4gICAgaWYgKHRoaXMuaXNPcGVuKCkgJiYgdGhpcy5fbWVudSkge1xuICAgICAgdGhpcy5fbWVudS5wb3NpdGlvbih0aGlzLl9hbmNob3IuYW5jaG9yRWwsIHRoaXMucGxhY2VtZW50KTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JEcm9wZG93biwgTmdiRHJvcGRvd25BbmNob3IsIE5nYkRyb3Bkb3duVG9nZ2xlLCBOZ2JEcm9wZG93bk1lbnV9IGZyb20gJy4vZHJvcGRvd24nO1xuXG5leHBvcnQge05nYkRyb3Bkb3duLCBOZ2JEcm9wZG93blRvZ2dsZSwgTmdiRHJvcGRvd25NZW51fSBmcm9tICcuL2Ryb3Bkb3duJztcbmV4cG9ydCB7TmdiRHJvcGRvd25Db25maWd9IGZyb20gJy4vZHJvcGRvd24tY29uZmlnJztcblxuY29uc3QgTkdCX0RST1BET1dOX0RJUkVDVElWRVMgPSBbTmdiRHJvcGRvd24sIE5nYkRyb3Bkb3duQW5jaG9yLCBOZ2JEcm9wZG93blRvZ2dsZSwgTmdiRHJvcGRvd25NZW51XTtcblxuQE5nTW9kdWxlKHtkZWNsYXJhdGlvbnM6IE5HQl9EUk9QRE9XTl9ESVJFQ1RJVkVTLCBleHBvcnRzOiBOR0JfRFJPUERPV05fRElSRUNUSVZFU30pXG5leHBvcnQgY2xhc3MgTmdiRHJvcGRvd25Nb2R1bGUge1xuICAvKipcbiAgICogSW1wb3J0aW5nIHdpdGggJy5mb3JSb290KCknIGlzIG5vIGxvbmdlciBuZWNlc3NhcnksIHlvdSBjYW4gc2ltcGx5IGltcG9ydCB0aGUgbW9kdWxlLlxuICAgKiBXaWxsIGJlIHJlbW92ZWQgaW4gNC4wLjAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiRHJvcGRvd25Nb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGUsIEluamVjdG9yfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBSZXByZXNlbnQgb3B0aW9ucyBhdmFpbGFibGUgd2hlbiBvcGVuaW5nIG5ldyBtb2RhbCB3aW5kb3dzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYk1vZGFsT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTZXRzIHRoZSBhcmlhIGF0dHJpYnV0ZSBhcmlhLWxhYmVsbGVkYnkgdG8gYSBtb2RhbCB3aW5kb3cuXG4gICAqXG4gICAqIEBzaW5jZSAyLjIuMFxuICAgKi9cbiAgYXJpYUxhYmVsbGVkQnk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgYSBiYWNrZHJvcCBlbGVtZW50IHNob3VsZCBiZSBjcmVhdGVkIGZvciBhIGdpdmVuIG1vZGFsICh0cnVlIGJ5IGRlZmF1bHQpLlxuICAgKiBBbHRlcm5hdGl2ZWx5LCBzcGVjaWZ5ICdzdGF0aWMnIGZvciBhIGJhY2tkcm9wIHdoaWNoIGRvZXNuJ3QgY2xvc2UgdGhlIG1vZGFsIG9uIGNsaWNrLlxuICAgKi9cbiAgYmFja2Ryb3A/OiBib29sZWFuIHwgJ3N0YXRpYyc7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIGNhbGxlZCB3aGVuIGEgbW9kYWwgd2lsbCBiZSBkaXNtaXNzZWQuXG4gICAqIElmIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBmYWxzZSwgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCBmYWxzZSBvciB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCwgdGhlIG1vZGFsIGlzIG5vdFxuICAgKiBkaXNtaXNzZWQuXG4gICAqL1xuICBiZWZvcmVEaXNtaXNzPzogKCkgPT4gYm9vbGVhbiB8IFByb21pc2U8Ym9vbGVhbj47XG5cbiAgLyoqXG4gICAqIFRvIGNlbnRlciB0aGUgbW9kYWwgdmVydGljYWxseSAoZmFsc2UgYnkgZGVmYXVsdCkuXG4gICAqXG4gICAqIEBzaW5jZSAxLjEuMFxuICAgKi9cbiAgY2VudGVyZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBbiBlbGVtZW50IHRvIHdoaWNoIHRvIGF0dGFjaCBuZXdseSBvcGVuZWQgbW9kYWwgd2luZG93cy5cbiAgICovXG4gIGNvbnRhaW5lcj86IHN0cmluZztcblxuICAvKipcbiAgICogSW5qZWN0b3IgdG8gdXNlIGZvciBtb2RhbCBjb250ZW50LlxuICAgKi9cbiAgaW5qZWN0b3I/OiBJbmplY3RvcjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBjbG9zZSB0aGUgbW9kYWwgd2hlbiBlc2NhcGUga2V5IGlzIHByZXNzZWQgKHRydWUgYnkgZGVmYXVsdCkuXG4gICAqL1xuICBrZXlib2FyZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNpemUgb2YgYSBuZXcgbW9kYWwgd2luZG93LlxuICAgKi9cbiAgc2l6ZT86ICdzbScgfCAnbGcnO1xuXG4gIC8qKlxuICAgKiBDdXN0b20gY2xhc3MgdG8gYXBwZW5kIHRvIHRoZSBtb2RhbCB3aW5kb3dcbiAgICovXG4gIHdpbmRvd0NsYXNzPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDdXN0b20gY2xhc3MgdG8gYXBwZW5kIHRvIHRoZSBtb2RhbCBiYWNrZHJvcFxuICAgKlxuICAgKiBAc2luY2UgMS4xLjBcbiAgICovXG4gIGJhY2tkcm9wQ2xhc3M/OiBzdHJpbmc7XG59XG5cbi8qKlxuKiBDb25maWd1cmF0aW9uIG9iamVjdCB0b2tlbiBmb3IgdGhlIE5nYk1vZGFsIHNlcnZpY2UuXG4qIFlvdSBjYW4gcHJvdmlkZSB0aGlzIGNvbmZpZ3VyYXRpb24sIHR5cGljYWxseSBpbiB5b3VyIHJvb3QgbW9kdWxlIGluIG9yZGVyIHRvIHByb3ZpZGUgZGVmYXVsdCBvcHRpb24gdmFsdWVzIGZvciBldmVyeVxuKiBtb2RhbC5cbipcbiogQHNpbmNlIDMuMS4wXG4qL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiTW9kYWxDb25maWcgaW1wbGVtZW50cyBOZ2JNb2RhbE9wdGlvbnMge1xuICBiYWNrZHJvcDogYm9vbGVhbiB8ICdzdGF0aWMnID0gdHJ1ZTtcbiAga2V5Ym9hcmQgPSB0cnVlO1xufVxuIiwiaW1wb3J0IHtcbiAgSW5qZWN0b3IsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3UmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBSZW5kZXJlcjIsXG4gIENvbXBvbmVudFJlZixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgY2xhc3MgQ29udGVudFJlZiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBub2RlczogYW55W10sIHB1YmxpYyB2aWV3UmVmPzogVmlld1JlZiwgcHVibGljIGNvbXBvbmVudFJlZj86IENvbXBvbmVudFJlZjxhbnk+KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgUG9wdXBTZXJ2aWNlPFQ+IHtcbiAgcHJpdmF0ZSBfd2luZG93UmVmOiBDb21wb25lbnRSZWY8VD47XG4gIHByaXZhdGUgX2NvbnRlbnRSZWY6IENvbnRlbnRSZWY7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF90eXBlOiBhbnksIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKSB7fVxuXG4gIG9wZW4oY29udGVudD86IHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT4sIGNvbnRleHQ/OiBhbnkpOiBDb21wb25lbnRSZWY8VD4ge1xuICAgIGlmICghdGhpcy5fd2luZG93UmVmKSB7XG4gICAgICB0aGlzLl9jb250ZW50UmVmID0gdGhpcy5fZ2V0Q29udGVudFJlZihjb250ZW50LCBjb250ZXh0KTtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZiA9IHRoaXMuX3ZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KFxuICAgICAgICAgIHRoaXMuX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeTxUPih0aGlzLl90eXBlKSwgMCwgdGhpcy5faW5qZWN0b3IsXG4gICAgICAgICAgdGhpcy5fY29udGVudFJlZi5ub2Rlcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3dpbmRvd1JlZjtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIGlmICh0aGlzLl93aW5kb3dSZWYpIHtcbiAgICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYucmVtb3ZlKHRoaXMuX3ZpZXdDb250YWluZXJSZWYuaW5kZXhPZih0aGlzLl93aW5kb3dSZWYuaG9zdFZpZXcpKTtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZiA9IG51bGw7XG5cbiAgICAgIGlmICh0aGlzLl9jb250ZW50UmVmLnZpZXdSZWYpIHtcbiAgICAgICAgdGhpcy5fdmlld0NvbnRhaW5lclJlZi5yZW1vdmUodGhpcy5fdmlld0NvbnRhaW5lclJlZi5pbmRleE9mKHRoaXMuX2NvbnRlbnRSZWYudmlld1JlZikpO1xuICAgICAgICB0aGlzLl9jb250ZW50UmVmID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRDb250ZW50UmVmKGNvbnRlbnQ6IHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT4sIGNvbnRleHQ/OiBhbnkpOiBDb250ZW50UmVmIHtcbiAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBuZXcgQ29udGVudFJlZihbXSk7XG4gICAgfSBlbHNlIGlmIChjb250ZW50IGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIGNvbnN0IHZpZXdSZWYgPSB0aGlzLl92aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyg8VGVtcGxhdGVSZWY8VD4+Y29udGVudCwgY29udGV4dCk7XG4gICAgICByZXR1cm4gbmV3IENvbnRlbnRSZWYoW3ZpZXdSZWYucm9vdE5vZGVzXSwgdmlld1JlZik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgQ29udGVudFJlZihbW3RoaXMuX3JlbmRlcmVyLmNyZWF0ZVRleHQoYCR7Y29udGVudH1gKV1dKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZSwgSW5qZWN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuXG5cblxuLyoqIFR5cGUgZm9yIHRoZSBjYWxsYmFjayB1c2VkIHRvIHJldmVydCB0aGUgc2Nyb2xsYmFyIGNvbXBlbnNhdGlvbi4gKi9cbmV4cG9ydCB0eXBlIENvbXBlbnNhdGlvblJldmVydGVyID0gKCkgPT4gdm9pZDtcblxuXG5cbi8qKlxuICogVXRpbGl0eSB0byBoYW5kbGUgdGhlIHNjcm9sbGJhci5cbiAqXG4gKiBJdCBhbGxvd3MgdG8gY29tcGVuc2F0ZSB0aGUgbGFjayBvZiBhIHZlcnRpY2FsIHNjcm9sbGJhciBieSBhZGRpbmcgYW5cbiAqIGVxdWl2YWxlbnQgcGFkZGluZyBvbiB0aGUgcmlnaHQgb2YgdGhlIGJvZHksIGFuZCB0byByZW1vdmUgdGhpcyBjb21wZW5zYXRpb24uXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIFNjcm9sbEJhciB7XG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnkpIHt9XG5cbiAgLyoqXG4gICAqIERldGVjdHMgaWYgYSBzY3JvbGxiYXIgaXMgcHJlc2VudCBhbmQgaWYgeWVzLCBhbHJlYWR5IGNvbXBlbnNhdGVzIGZvciBpdHNcbiAgICogcmVtb3ZhbCBieSBhZGRpbmcgYW4gZXF1aXZhbGVudCBwYWRkaW5nIG9uIHRoZSByaWdodCBvZiB0aGUgYm9keS5cbiAgICpcbiAgICogQHJldHVybiBhIGNhbGxiYWNrIHVzZWQgdG8gcmV2ZXJ0IHRoZSBjb21wZW5zYXRpb24gKG5vb3AgaWYgdGhlcmUgd2FzIG5vbmUsXG4gICAqIG90aGVyd2lzZSBhIGZ1bmN0aW9uIHJlbW92aW5nIHRoZSBwYWRkaW5nKVxuICAgKi9cbiAgY29tcGVuc2F0ZSgpOiBDb21wZW5zYXRpb25SZXZlcnRlciB7IHJldHVybiAhdGhpcy5faXNQcmVzZW50KCkgPyBub29wIDogdGhpcy5fYWRqdXN0Qm9keSh0aGlzLl9nZXRXaWR0aCgpKTsgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcGFkZGluZyBvZiB0aGUgZ2l2ZW4gd2lkdGggb24gdGhlIHJpZ2h0IG9mIHRoZSBib2R5LlxuICAgKlxuICAgKiBAcmV0dXJuIGEgY2FsbGJhY2sgdXNlZCB0byByZXZlcnQgdGhlIHBhZGRpbmcgdG8gaXRzIHByZXZpb3VzIHZhbHVlXG4gICAqL1xuICBwcml2YXRlIF9hZGp1c3RCb2R5KHdpZHRoOiBudW1iZXIpOiBDb21wZW5zYXRpb25SZXZlcnRlciB7XG4gICAgY29uc3QgYm9keSA9IHRoaXMuX2RvY3VtZW50LmJvZHk7XG4gICAgY29uc3QgdXNlclNldFBhZGRpbmcgPSBib2R5LnN0eWxlLnBhZGRpbmdSaWdodDtcbiAgICBjb25zdCBwYWRkaW5nQW1vdW50ID0gcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShib2R5KVsncGFkZGluZy1yaWdodCddKTtcbiAgICBib2R5LnN0eWxlWydwYWRkaW5nLXJpZ2h0J10gPSBgJHtwYWRkaW5nQW1vdW50ICsgd2lkdGh9cHhgO1xuICAgIHJldHVybiAoKSA9PiBib2R5LnN0eWxlWydwYWRkaW5nLXJpZ2h0J10gPSB1c2VyU2V0UGFkZGluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBUZWxscyB3aGV0aGVyIGEgc2Nyb2xsYmFyIGlzIGN1cnJlbnRseSBwcmVzZW50IG9uIHRoZSBib2R5LlxuICAgKlxuICAgKiBAcmV0dXJuIHRydWUgaWYgc2Nyb2xsYmFyIGlzIHByZXNlbnQsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgcHJpdmF0ZSBfaXNQcmVzZW50KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJlY3QgPSB0aGlzLl9kb2N1bWVudC5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiByZWN0LmxlZnQgKyByZWN0LnJpZ2h0IDwgd2luZG93LmlubmVyV2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyB0aGUgd2lkdGggb2YgYSBzY3JvbGxiYXIuXG4gICAqXG4gICAqIEByZXR1cm4gdGhlIHdpZHRoIG9mIGEgc2Nyb2xsYmFyIG9uIHRoaXMgcGFnZVxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0V2lkdGgoKTogbnVtYmVyIHtcbiAgICBjb25zdCBtZWFzdXJlciA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG1lYXN1cmVyLmNsYXNzTmFtZSA9ICdtb2RhbC1zY3JvbGxiYXItbWVhc3VyZSc7XG5cbiAgICBjb25zdCBib2R5ID0gdGhpcy5fZG9jdW1lbnQuYm9keTtcbiAgICBib2R5LmFwcGVuZENoaWxkKG1lYXN1cmVyKTtcbiAgICBjb25zdCB3aWR0aCA9IG1lYXN1cmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gbWVhc3VyZXIuY2xpZW50V2lkdGg7XG4gICAgYm9keS5yZW1vdmVDaGlsZChtZWFzdXJlcik7XG5cbiAgICByZXR1cm4gd2lkdGg7XG4gIH1cbn1cbiIsImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1tb2RhbC1iYWNrZHJvcCcsXG4gIHRlbXBsYXRlOiAnJyxcbiAgaG9zdDpcbiAgICAgIHsnW2NsYXNzXSc6ICdcIm1vZGFsLWJhY2tkcm9wIGZhZGUgc2hvd1wiICsgKGJhY2tkcm9wQ2xhc3MgPyBcIiBcIiArIGJhY2tkcm9wQ2xhc3MgOiBcIlwiKScsICdzdHlsZSc6ICd6LWluZGV4OiAxMDUwJ31cbn0pXG5leHBvcnQgY2xhc3MgTmdiTW9kYWxCYWNrZHJvcCB7XG4gIEBJbnB1dCgpIGJhY2tkcm9wQ2xhc3M6IHN0cmluZztcbn1cbiIsImltcG9ydCB7Q29tcG9uZW50UmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtOZ2JNb2RhbEJhY2tkcm9wfSBmcm9tICcuL21vZGFsLWJhY2tkcm9wJztcbmltcG9ydCB7TmdiTW9kYWxXaW5kb3d9IGZyb20gJy4vbW9kYWwtd2luZG93JztcblxuaW1wb3J0IHtDb250ZW50UmVmfSBmcm9tICcuLi91dGlsL3BvcHVwJztcblxuLyoqXG4gKiBBIHJlZmVyZW5jZSB0byBhbiBhY3RpdmUgKGN1cnJlbnRseSBvcGVuZWQpIG1vZGFsLiBJbnN0YW5jZXMgb2YgdGhpcyBjbGFzc1xuICogY2FuIGJlIGluamVjdGVkIGludG8gY29tcG9uZW50cyBwYXNzZWQgYXMgbW9kYWwgY29udGVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIE5nYkFjdGl2ZU1vZGFsIHtcbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgbW9kYWwgd2l0aCBhbiBvcHRpb25hbCAncmVzdWx0JyB2YWx1ZS5cbiAgICogVGhlICdOZ2JNb2JhbFJlZi5yZXN1bHQnIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoIHByb3ZpZGVkIHZhbHVlLlxuICAgKi9cbiAgY2xvc2UocmVzdWx0PzogYW55KTogdm9pZCB7fVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIG1vZGFsIHdpdGggYW4gb3B0aW9uYWwgJ3JlYXNvbicgdmFsdWUuXG4gICAqIFRoZSAnTmdiTW9kYWxSZWYucmVzdWx0JyBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCBwcm92aWRlZCB2YWx1ZS5cbiAgICovXG4gIGRpc21pc3MocmVhc29uPzogYW55KTogdm9pZCB7fVxufVxuXG4vKipcbiAqIEEgcmVmZXJlbmNlIHRvIGEgbmV3bHkgb3BlbmVkIG1vZGFsIHJldHVybmVkIGJ5IHRoZSAnTmdiTW9kYWwub3BlbigpJyBtZXRob2QuXG4gKi9cbmV4cG9ydCBjbGFzcyBOZ2JNb2RhbFJlZiB7XG4gIHByaXZhdGUgX3Jlc29sdmU6IChyZXN1bHQ/OiBhbnkpID0+IHZvaWQ7XG4gIHByaXZhdGUgX3JlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZDtcblxuICAvKipcbiAgICogVGhlIGluc3RhbmNlIG9mIGNvbXBvbmVudCB1c2VkIGFzIG1vZGFsJ3MgY29udGVudC5cbiAgICogVW5kZWZpbmVkIHdoZW4gYSBUZW1wbGF0ZVJlZiBpcyB1c2VkIGFzIG1vZGFsJ3MgY29udGVudC5cbiAgICovXG4gIGdldCBjb21wb25lbnRJbnN0YW5jZSgpOiBhbnkge1xuICAgIGlmICh0aGlzLl9jb250ZW50UmVmLmNvbXBvbmVudFJlZikge1xuICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRSZWYuY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIHRoZSBtb2RhbCBpcyBjbG9zZWQgYW5kIHJlamVjdGVkIHdoZW4gdGhlIG1vZGFsIGlzIGRpc21pc3NlZC5cbiAgICovXG4gIHJlc3VsdDogUHJvbWlzZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfd2luZG93Q21wdFJlZjogQ29tcG9uZW50UmVmPE5nYk1vZGFsV2luZG93PiwgcHJpdmF0ZSBfY29udGVudFJlZjogQ29udGVudFJlZixcbiAgICAgIHByaXZhdGUgX2JhY2tkcm9wQ21wdFJlZj86IENvbXBvbmVudFJlZjxOZ2JNb2RhbEJhY2tkcm9wPiwgcHJpdmF0ZSBfYmVmb3JlRGlzbWlzcz86IEZ1bmN0aW9uKSB7XG4gICAgX3dpbmRvd0NtcHRSZWYuaW5zdGFuY2UuZGlzbWlzc0V2ZW50LnN1YnNjcmliZSgocmVhc29uOiBhbnkpID0+IHsgdGhpcy5kaXNtaXNzKHJlYXNvbik7IH0pO1xuXG4gICAgdGhpcy5yZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLl9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMuX3JlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcbiAgICB0aGlzLnJlc3VsdC50aGVuKG51bGwsICgpID0+IHt9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIG1vZGFsIHdpdGggYW4gb3B0aW9uYWwgJ3Jlc3VsdCcgdmFsdWUuXG4gICAqIFRoZSAnTmdiTW9iYWxSZWYucmVzdWx0JyBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aCBwcm92aWRlZCB2YWx1ZS5cbiAgICovXG4gIGNsb3NlKHJlc3VsdD86IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl93aW5kb3dDbXB0UmVmKSB7XG4gICAgICB0aGlzLl9yZXNvbHZlKHJlc3VsdCk7XG4gICAgICB0aGlzLl9yZW1vdmVNb2RhbEVsZW1lbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZGlzbWlzcyhyZWFzb24/OiBhbnkpIHtcbiAgICB0aGlzLl9yZWplY3QocmVhc29uKTtcbiAgICB0aGlzLl9yZW1vdmVNb2RhbEVsZW1lbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBtb2RhbCB3aXRoIGFuIG9wdGlvbmFsICdyZWFzb24nIHZhbHVlLlxuICAgKiBUaGUgJ05nYk1vZGFsUmVmLnJlc3VsdCcgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGggcHJvdmlkZWQgdmFsdWUuXG4gICAqL1xuICBkaXNtaXNzKHJlYXNvbj86IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl93aW5kb3dDbXB0UmVmKSB7XG4gICAgICBpZiAoIXRoaXMuX2JlZm9yZURpc21pc3MpIHtcbiAgICAgICAgdGhpcy5fZGlzbWlzcyhyZWFzb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGlzbWlzcyA9IHRoaXMuX2JlZm9yZURpc21pc3MoKTtcbiAgICAgICAgaWYgKGRpc21pc3MgJiYgZGlzbWlzcy50aGVuKSB7XG4gICAgICAgICAgZGlzbWlzcy50aGVuKFxuICAgICAgICAgICAgICByZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl9kaXNtaXNzKHJlYXNvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAoKSA9PiB7fSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlzbWlzcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLl9kaXNtaXNzKHJlYXNvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9yZW1vdmVNb2RhbEVsZW1lbnRzKCkge1xuICAgIGNvbnN0IHdpbmRvd05hdGl2ZUVsID0gdGhpcy5fd2luZG93Q21wdFJlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50O1xuICAgIHdpbmRvd05hdGl2ZUVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQod2luZG93TmF0aXZlRWwpO1xuICAgIHRoaXMuX3dpbmRvd0NtcHRSZWYuZGVzdHJveSgpO1xuXG4gICAgaWYgKHRoaXMuX2JhY2tkcm9wQ21wdFJlZikge1xuICAgICAgY29uc3QgYmFja2Ryb3BOYXRpdmVFbCA9IHRoaXMuX2JhY2tkcm9wQ21wdFJlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50O1xuICAgICAgYmFja2Ryb3BOYXRpdmVFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJhY2tkcm9wTmF0aXZlRWwpO1xuICAgICAgdGhpcy5fYmFja2Ryb3BDbXB0UmVmLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY29udGVudFJlZiAmJiB0aGlzLl9jb250ZW50UmVmLnZpZXdSZWYpIHtcbiAgICAgIHRoaXMuX2NvbnRlbnRSZWYudmlld1JlZi5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5fd2luZG93Q21wdFJlZiA9IG51bGw7XG4gICAgdGhpcy5fYmFja2Ryb3BDbXB0UmVmID0gbnVsbDtcbiAgICB0aGlzLl9jb250ZW50UmVmID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGVudW0gTW9kYWxEaXNtaXNzUmVhc29ucyB7XG4gIEJBQ0tEUk9QX0NMSUNLLFxuICBFU0Ncbn1cbiIsImltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtnZXRGb2N1c2FibGVCb3VuZGFyeUVsZW1lbnRzfSBmcm9tICcuLi91dGlsL2ZvY3VzLXRyYXAnO1xuaW1wb3J0IHtNb2RhbERpc21pc3NSZWFzb25zfSBmcm9tICcuL21vZGFsLWRpc21pc3MtcmVhc29ucyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1tb2RhbC13aW5kb3cnLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzc10nOiAnXCJtb2RhbCBmYWRlIHNob3cgZC1ibG9ja1wiICsgKHdpbmRvd0NsYXNzID8gXCIgXCIgKyB3aW5kb3dDbGFzcyA6IFwiXCIpJyxcbiAgICAncm9sZSc6ICdkaWFsb2cnLFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJyhrZXl1cC5lc2MpJzogJ2VzY0tleSgkZXZlbnQpJyxcbiAgICAnKGNsaWNrKSc6ICdiYWNrZHJvcENsaWNrKCRldmVudCknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ2FyaWFMYWJlbGxlZEJ5JyxcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IFtjbGFzc109XCInbW9kYWwtZGlhbG9nJyArIChzaXplID8gJyBtb2RhbC0nICsgc2l6ZSA6ICcnKSArIChjZW50ZXJlZCA/ICcgbW9kYWwtZGlhbG9nLWNlbnRlcmVkJyA6ICcnKVwiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYk1vZGFsV2luZG93IGltcGxlbWVudHMgT25Jbml0LFxuICAgIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2VsV2l0aEZvY3VzOiBFbGVtZW50OyAgLy8gZWxlbWVudCB0aGF0IGlzIGZvY3VzZWQgcHJpb3IgdG8gbW9kYWwgb3BlbmluZ1xuXG4gIEBJbnB1dCgpIGFyaWFMYWJlbGxlZEJ5OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGJhY2tkcm9wOiBib29sZWFuIHwgc3RyaW5nID0gdHJ1ZTtcbiAgQElucHV0KCkgY2VudGVyZWQ6IHN0cmluZztcbiAgQElucHV0KCkga2V5Ym9hcmQgPSB0cnVlO1xuICBASW5wdXQoKSBzaXplOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHdpbmRvd0NsYXNzOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgnZGlzbWlzcycpIGRpc21pc3NFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LCBwcml2YXRlIF9lbFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHt9XG5cbiAgYmFja2Ryb3BDbGljaygkZXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5iYWNrZHJvcCA9PT0gdHJ1ZSAmJiB0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50ID09PSAkZXZlbnQudGFyZ2V0KSB7XG4gICAgICB0aGlzLmRpc21pc3MoTW9kYWxEaXNtaXNzUmVhc29ucy5CQUNLRFJPUF9DTElDSyk7XG4gICAgfVxuICB9XG5cbiAgZXNjS2V5KCRldmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmtleWJvYXJkICYmICEkZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgdGhpcy5kaXNtaXNzKE1vZGFsRGlzbWlzc1JlYXNvbnMuRVNDKTtcbiAgICB9XG4gIH1cblxuICBkaXNtaXNzKHJlYXNvbik6IHZvaWQgeyB0aGlzLmRpc21pc3NFdmVudC5lbWl0KHJlYXNvbik7IH1cblxuICBuZ09uSW5pdCgpIHsgdGhpcy5fZWxXaXRoRm9jdXMgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50OyB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICghdGhpcy5fZWxSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgY29uc3QgYXV0b0ZvY3VzYWJsZSA9IHRoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihgW25nYkF1dG9mb2N1c11gKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGNvbnN0IGZpcnN0Rm9jdXNhYmxlID0gZ2V0Rm9jdXNhYmxlQm91bmRhcnlFbGVtZW50cyh0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50KVswXTtcblxuICAgICAgY29uc3QgZWxlbWVudFRvRm9jdXMgPSBhdXRvRm9jdXNhYmxlIHx8IGZpcnN0Rm9jdXNhYmxlIHx8IHRoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBlbGVtZW50VG9Gb2N1cy5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGJvZHkgPSB0aGlzLl9kb2N1bWVudC5ib2R5O1xuICAgIGNvbnN0IGVsV2l0aEZvY3VzID0gdGhpcy5fZWxXaXRoRm9jdXM7XG5cbiAgICBsZXQgZWxlbWVudFRvRm9jdXM7XG4gICAgaWYgKGVsV2l0aEZvY3VzICYmIGVsV2l0aEZvY3VzWydmb2N1cyddICYmIGJvZHkuY29udGFpbnMoZWxXaXRoRm9jdXMpKSB7XG4gICAgICBlbGVtZW50VG9Gb2N1cyA9IGVsV2l0aEZvY3VzO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50VG9Gb2N1cyA9IGJvZHk7XG4gICAgfVxuICAgIGVsZW1lbnRUb0ZvY3VzLmZvY3VzKCk7XG4gICAgdGhpcy5fZWxXaXRoRm9jdXMgPSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQXBwbGljYXRpb25SZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgQ29tcG9uZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGFibGUsXG4gIEluamVjdG9yLFxuICBSZW5kZXJlckZhY3RvcnkyLFxuICBUZW1wbGF0ZVJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge25nYkZvY3VzVHJhcH0gZnJvbSAnLi4vdXRpbC9mb2N1cy10cmFwJztcbmltcG9ydCB7Q29udGVudFJlZn0gZnJvbSAnLi4vdXRpbC9wb3B1cCc7XG5pbXBvcnQge1Njcm9sbEJhcn0gZnJvbSAnLi4vdXRpbC9zY3JvbGxiYXInO1xuaW1wb3J0IHtpc0RlZmluZWQsIGlzU3RyaW5nfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JNb2RhbEJhY2tkcm9wfSBmcm9tICcuL21vZGFsLWJhY2tkcm9wJztcbmltcG9ydCB7TmdiQWN0aXZlTW9kYWwsIE5nYk1vZGFsUmVmfSBmcm9tICcuL21vZGFsLXJlZic7XG5pbXBvcnQge05nYk1vZGFsV2luZG93fSBmcm9tICcuL21vZGFsLXdpbmRvdyc7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYk1vZGFsU3RhY2sge1xuICBwcml2YXRlIF93aW5kb3dBdHRyaWJ1dGVzID0gWydhcmlhTGFiZWxsZWRCeScsICdiYWNrZHJvcCcsICdjZW50ZXJlZCcsICdrZXlib2FyZCcsICdzaXplJywgJ3dpbmRvd0NsYXNzJ107XG4gIHByaXZhdGUgX2JhY2tkcm9wQXR0cmlidXRlcyA9IFsnYmFja2Ryb3BDbGFzcyddO1xuICBwcml2YXRlIF9tb2RhbFJlZnM6IE5nYk1vZGFsUmVmW10gPSBbXTtcbiAgcHJpdmF0ZSBfd2luZG93Q21wdHM6IENvbXBvbmVudFJlZjxOZ2JNb2RhbFdpbmRvdz5bXSA9IFtdO1xuICBwcml2YXRlIF9hY3RpdmVXaW5kb3dDbXB0SGFzQ2hhbmdlZCA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9hcHBsaWNhdGlvblJlZjogQXBwbGljYXRpb25SZWYsIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvciwgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICAgIHByaXZhdGUgX3Njcm9sbEJhcjogU2Nyb2xsQmFyLCBwcml2YXRlIF9yZW5kZXJlckZhY3Rvcnk6IFJlbmRlcmVyRmFjdG9yeTIpIHtcbiAgICAvLyBUcmFwIGZvY3VzIG9uIGFjdGl2ZSBXaW5kb3dDbXB0XG4gICAgdGhpcy5fYWN0aXZlV2luZG93Q21wdEhhc0NoYW5nZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl93aW5kb3dDbXB0cy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgYWN0aXZlV2luZG93Q21wdCA9IHRoaXMuX3dpbmRvd0NtcHRzW3RoaXMuX3dpbmRvd0NtcHRzLmxlbmd0aCAtIDFdO1xuICAgICAgICBuZ2JGb2N1c1RyYXAoYWN0aXZlV2luZG93Q21wdC5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LCB0aGlzLl9hY3RpdmVXaW5kb3dDbXB0SGFzQ2hhbmdlZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBvcGVuKG1vZHVsZUNGUjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBjb250ZW50SW5qZWN0b3I6IEluamVjdG9yLCBjb250ZW50OiBhbnksIG9wdGlvbnMpOiBOZ2JNb2RhbFJlZiB7XG4gICAgY29uc3QgY29udGFpbmVyRWwgPVxuICAgICAgICBpc0RlZmluZWQob3B0aW9ucy5jb250YWluZXIpID8gdGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLmNvbnRhaW5lcikgOiB0aGlzLl9kb2N1bWVudC5ib2R5O1xuICAgIGNvbnN0IHJlbmRlcmVyID0gdGhpcy5fcmVuZGVyZXJGYWN0b3J5LmNyZWF0ZVJlbmRlcmVyKG51bGwsIG51bGwpO1xuXG4gICAgY29uc3QgcmV2ZXJ0UGFkZGluZ0ZvclNjcm9sbEJhciA9IHRoaXMuX3Njcm9sbEJhci5jb21wZW5zYXRlKCk7XG4gICAgY29uc3QgcmVtb3ZlQm9keUNsYXNzID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9tb2RhbFJlZnMubGVuZ3RoKSB7XG4gICAgICAgIHJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuX2RvY3VtZW50LmJvZHksICdtb2RhbC1vcGVuJyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICghY29udGFpbmVyRWwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHNwZWNpZmllZCBtb2RhbCBjb250YWluZXIgXCIke29wdGlvbnMuY29udGFpbmVyIHx8ICdib2R5J31cIiB3YXMgbm90IGZvdW5kIGluIHRoZSBET00uYCk7XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlTW9kYWwgPSBuZXcgTmdiQWN0aXZlTW9kYWwoKTtcbiAgICBjb25zdCBjb250ZW50UmVmID0gdGhpcy5fZ2V0Q29udGVudFJlZihtb2R1bGVDRlIsIG9wdGlvbnMuaW5qZWN0b3IgfHwgY29udGVudEluamVjdG9yLCBjb250ZW50LCBhY3RpdmVNb2RhbCk7XG5cbiAgICBsZXQgYmFja2Ryb3BDbXB0UmVmOiBDb21wb25lbnRSZWY8TmdiTW9kYWxCYWNrZHJvcD4gPVxuICAgICAgICBvcHRpb25zLmJhY2tkcm9wICE9PSBmYWxzZSA/IHRoaXMuX2F0dGFjaEJhY2tkcm9wKG1vZHVsZUNGUiwgY29udGFpbmVyRWwpIDogbnVsbDtcbiAgICBsZXQgd2luZG93Q21wdFJlZjogQ29tcG9uZW50UmVmPE5nYk1vZGFsV2luZG93PiA9IHRoaXMuX2F0dGFjaFdpbmRvd0NvbXBvbmVudChtb2R1bGVDRlIsIGNvbnRhaW5lckVsLCBjb250ZW50UmVmKTtcbiAgICBsZXQgbmdiTW9kYWxSZWY6IE5nYk1vZGFsUmVmID0gbmV3IE5nYk1vZGFsUmVmKHdpbmRvd0NtcHRSZWYsIGNvbnRlbnRSZWYsIGJhY2tkcm9wQ21wdFJlZiwgb3B0aW9ucy5iZWZvcmVEaXNtaXNzKTtcblxuICAgIHRoaXMuX3JlZ2lzdGVyTW9kYWxSZWYobmdiTW9kYWxSZWYpO1xuICAgIHRoaXMuX3JlZ2lzdGVyV2luZG93Q21wdCh3aW5kb3dDbXB0UmVmKTtcbiAgICBuZ2JNb2RhbFJlZi5yZXN1bHQudGhlbihyZXZlcnRQYWRkaW5nRm9yU2Nyb2xsQmFyLCByZXZlcnRQYWRkaW5nRm9yU2Nyb2xsQmFyKTtcbiAgICBuZ2JNb2RhbFJlZi5yZXN1bHQudGhlbihyZW1vdmVCb2R5Q2xhc3MsIHJlbW92ZUJvZHlDbGFzcyk7XG4gICAgYWN0aXZlTW9kYWwuY2xvc2UgPSAocmVzdWx0OiBhbnkpID0+IHsgbmdiTW9kYWxSZWYuY2xvc2UocmVzdWx0KTsgfTtcbiAgICBhY3RpdmVNb2RhbC5kaXNtaXNzID0gKHJlYXNvbjogYW55KSA9PiB7IG5nYk1vZGFsUmVmLmRpc21pc3MocmVhc29uKTsgfTtcblxuICAgIHRoaXMuX2FwcGx5V2luZG93T3B0aW9ucyh3aW5kb3dDbXB0UmVmLmluc3RhbmNlLCBvcHRpb25zKTtcbiAgICBpZiAodGhpcy5fbW9kYWxSZWZzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5fZG9jdW1lbnQuYm9keSwgJ21vZGFsLW9wZW4nKTtcbiAgICB9XG5cbiAgICBpZiAoYmFja2Ryb3BDbXB0UmVmICYmIGJhY2tkcm9wQ21wdFJlZi5pbnN0YW5jZSkge1xuICAgICAgdGhpcy5fYXBwbHlCYWNrZHJvcE9wdGlvbnMoYmFja2Ryb3BDbXB0UmVmLmluc3RhbmNlLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIG5nYk1vZGFsUmVmO1xuICB9XG5cbiAgZGlzbWlzc0FsbChyZWFzb24/OiBhbnkpIHsgdGhpcy5fbW9kYWxSZWZzLmZvckVhY2gobmdiTW9kYWxSZWYgPT4gbmdiTW9kYWxSZWYuZGlzbWlzcyhyZWFzb24pKTsgfVxuXG4gIGhhc09wZW5Nb2RhbHMoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9tb2RhbFJlZnMubGVuZ3RoID4gMDsgfVxuXG4gIHByaXZhdGUgX2F0dGFjaEJhY2tkcm9wKG1vZHVsZUNGUjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBjb250YWluZXJFbDogYW55KTogQ29tcG9uZW50UmVmPE5nYk1vZGFsQmFja2Ryb3A+IHtcbiAgICBsZXQgYmFja2Ryb3BGYWN0b3J5ID0gbW9kdWxlQ0ZSLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KE5nYk1vZGFsQmFja2Ryb3ApO1xuICAgIGxldCBiYWNrZHJvcENtcHRSZWYgPSBiYWNrZHJvcEZhY3RvcnkuY3JlYXRlKHRoaXMuX2luamVjdG9yKTtcbiAgICB0aGlzLl9hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KGJhY2tkcm9wQ21wdFJlZi5ob3N0Vmlldyk7XG4gICAgY29udGFpbmVyRWwuYXBwZW5kQ2hpbGQoYmFja2Ryb3BDbXB0UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHJldHVybiBiYWNrZHJvcENtcHRSZWY7XG4gIH1cblxuICBwcml2YXRlIF9hdHRhY2hXaW5kb3dDb21wb25lbnQobW9kdWxlQ0ZSOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIGNvbnRhaW5lckVsOiBhbnksIGNvbnRlbnRSZWY6IGFueSk6XG4gICAgICBDb21wb25lbnRSZWY8TmdiTW9kYWxXaW5kb3c+IHtcbiAgICBsZXQgd2luZG93RmFjdG9yeSA9IG1vZHVsZUNGUi5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShOZ2JNb2RhbFdpbmRvdyk7XG4gICAgbGV0IHdpbmRvd0NtcHRSZWYgPSB3aW5kb3dGYWN0b3J5LmNyZWF0ZSh0aGlzLl9pbmplY3RvciwgY29udGVudFJlZi5ub2Rlcyk7XG4gICAgdGhpcy5fYXBwbGljYXRpb25SZWYuYXR0YWNoVmlldyh3aW5kb3dDbXB0UmVmLmhvc3RWaWV3KTtcbiAgICBjb250YWluZXJFbC5hcHBlbmRDaGlsZCh3aW5kb3dDbXB0UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHJldHVybiB3aW5kb3dDbXB0UmVmO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlXaW5kb3dPcHRpb25zKHdpbmRvd0luc3RhbmNlOiBOZ2JNb2RhbFdpbmRvdywgb3B0aW9uczogT2JqZWN0KTogdm9pZCB7XG4gICAgdGhpcy5fd2luZG93QXR0cmlidXRlcy5mb3JFYWNoKChvcHRpb25OYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmIChpc0RlZmluZWQob3B0aW9uc1tvcHRpb25OYW1lXSkpIHtcbiAgICAgICAgd2luZG93SW5zdGFuY2Vbb3B0aW9uTmFtZV0gPSBvcHRpb25zW29wdGlvbk5hbWVdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlCYWNrZHJvcE9wdGlvbnMoYmFja2Ryb3BJbnN0YW5jZTogTmdiTW9kYWxCYWNrZHJvcCwgb3B0aW9uczogT2JqZWN0KTogdm9pZCB7XG4gICAgdGhpcy5fYmFja2Ryb3BBdHRyaWJ1dGVzLmZvckVhY2goKG9wdGlvbk5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKGlzRGVmaW5lZChvcHRpb25zW29wdGlvbk5hbWVdKSkge1xuICAgICAgICBiYWNrZHJvcEluc3RhbmNlW29wdGlvbk5hbWVdID0gb3B0aW9uc1tvcHRpb25OYW1lXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldENvbnRlbnRSZWYoXG4gICAgICBtb2R1bGVDRlI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgY29udGVudEluamVjdG9yOiBJbmplY3RvciwgY29udGVudDogYW55LFxuICAgICAgYWN0aXZlTW9kYWw6IE5nYkFjdGl2ZU1vZGFsKTogQ29udGVudFJlZiB7XG4gICAgaWYgKCFjb250ZW50KSB7XG4gICAgICByZXR1cm4gbmV3IENvbnRlbnRSZWYoW10pO1xuICAgIH0gZWxzZSBpZiAoY29udGVudCBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3JlYXRlRnJvbVRlbXBsYXRlUmVmKGNvbnRlbnQsIGFjdGl2ZU1vZGFsKTtcbiAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKGNvbnRlbnQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3JlYXRlRnJvbVN0cmluZyhjb250ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUZyb21Db21wb25lbnQobW9kdWxlQ0ZSLCBjb250ZW50SW5qZWN0b3IsIGNvbnRlbnQsIGFjdGl2ZU1vZGFsKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVGcm9tVGVtcGxhdGVSZWYoY29udGVudDogVGVtcGxhdGVSZWY8YW55PiwgYWN0aXZlTW9kYWw6IE5nYkFjdGl2ZU1vZGFsKTogQ29udGVudFJlZiB7XG4gICAgY29uc3QgY29udGV4dCA9IHtcbiAgICAgICRpbXBsaWNpdDogYWN0aXZlTW9kYWwsXG4gICAgICBjbG9zZShyZXN1bHQpIHsgYWN0aXZlTW9kYWwuY2xvc2UocmVzdWx0KTsgfSxcbiAgICAgIGRpc21pc3MocmVhc29uKSB7IGFjdGl2ZU1vZGFsLmRpc21pc3MocmVhc29uKTsgfVxuICAgIH07XG4gICAgY29uc3Qgdmlld1JlZiA9IGNvbnRlbnQuY3JlYXRlRW1iZWRkZWRWaWV3KGNvbnRleHQpO1xuICAgIHRoaXMuX2FwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcodmlld1JlZik7XG4gICAgcmV0dXJuIG5ldyBDb250ZW50UmVmKFt2aWV3UmVmLnJvb3ROb2Rlc10sIHZpZXdSZWYpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlRnJvbVN0cmluZyhjb250ZW50OiBzdHJpbmcpOiBDb250ZW50UmVmIHtcbiAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgJHtjb250ZW50fWApO1xuICAgIHJldHVybiBuZXcgQ29udGVudFJlZihbW2NvbXBvbmVudF1dKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUZyb21Db21wb25lbnQoXG4gICAgICBtb2R1bGVDRlI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgY29udGVudEluamVjdG9yOiBJbmplY3RvciwgY29udGVudDogYW55LFxuICAgICAgY29udGV4dDogTmdiQWN0aXZlTW9kYWwpOiBDb250ZW50UmVmIHtcbiAgICBjb25zdCBjb250ZW50Q21wdEZhY3RvcnkgPSBtb2R1bGVDRlIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoY29udGVudCk7XG4gICAgY29uc3QgbW9kYWxDb250ZW50SW5qZWN0b3IgPVxuICAgICAgICBJbmplY3Rvci5jcmVhdGUoe3Byb3ZpZGVyczogW3twcm92aWRlOiBOZ2JBY3RpdmVNb2RhbCwgdXNlVmFsdWU6IGNvbnRleHR9XSwgcGFyZW50OiBjb250ZW50SW5qZWN0b3J9KTtcbiAgICBjb25zdCBjb21wb25lbnRSZWYgPSBjb250ZW50Q21wdEZhY3RvcnkuY3JlYXRlKG1vZGFsQ29udGVudEluamVjdG9yKTtcbiAgICB0aGlzLl9hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KGNvbXBvbmVudFJlZi5ob3N0Vmlldyk7XG4gICAgcmV0dXJuIG5ldyBDb250ZW50UmVmKFtbY29tcG9uZW50UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnRdXSwgY29tcG9uZW50UmVmLmhvc3RWaWV3LCBjb21wb25lbnRSZWYpO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVnaXN0ZXJNb2RhbFJlZihuZ2JNb2RhbFJlZjogTmdiTW9kYWxSZWYpIHtcbiAgICBjb25zdCB1bnJlZ2lzdGVyTW9kYWxSZWYgPSAoKSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX21vZGFsUmVmcy5pbmRleE9mKG5nYk1vZGFsUmVmKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMuX21vZGFsUmVmcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5fbW9kYWxSZWZzLnB1c2gobmdiTW9kYWxSZWYpO1xuICAgIG5nYk1vZGFsUmVmLnJlc3VsdC50aGVuKHVucmVnaXN0ZXJNb2RhbFJlZiwgdW5yZWdpc3Rlck1vZGFsUmVmKTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlZ2lzdGVyV2luZG93Q21wdChuZ2JXaW5kb3dDbXB0OiBDb21wb25lbnRSZWY8TmdiTW9kYWxXaW5kb3c+KSB7XG4gICAgdGhpcy5fd2luZG93Q21wdHMucHVzaChuZ2JXaW5kb3dDbXB0KTtcbiAgICB0aGlzLl9hY3RpdmVXaW5kb3dDbXB0SGFzQ2hhbmdlZC5uZXh0KCk7XG5cbiAgICBuZ2JXaW5kb3dDbXB0Lm9uRGVzdHJveSgoKSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3dpbmRvd0NtcHRzLmluZGV4T2YobmdiV2luZG93Q21wdCk7XG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICB0aGlzLl93aW5kb3dDbXB0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLl9hY3RpdmVXaW5kb3dDbXB0SGFzQ2hhbmdlZC5uZXh0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZSwgSW5qZWN0b3IsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7TmdiTW9kYWxPcHRpb25zLCBOZ2JNb2RhbENvbmZpZ30gZnJvbSAnLi9tb2RhbC1jb25maWcnO1xuaW1wb3J0IHtOZ2JNb2RhbFJlZn0gZnJvbSAnLi9tb2RhbC1yZWYnO1xuaW1wb3J0IHtOZ2JNb2RhbFN0YWNrfSBmcm9tICcuL21vZGFsLXN0YWNrJztcblxuLyoqXG4gKiBBIHNlcnZpY2UgdG8gb3BlbiBtb2RhbCB3aW5kb3dzLiBDcmVhdGluZyBhIG1vZGFsIGlzIHN0cmFpZ2h0Zm9yd2FyZDogY3JlYXRlIGEgdGVtcGxhdGUgYW5kIHBhc3MgaXQgYXMgYW4gYXJndW1lbnQgdG9cbiAqIHRoZSBcIm9wZW5cIiBtZXRob2QhXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYk1vZGFsIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9tb2R1bGVDRlI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIF9tb2RhbFN0YWNrOiBOZ2JNb2RhbFN0YWNrLFxuICAgICAgcHJpdmF0ZSBfY29uZmlnOiBOZ2JNb2RhbENvbmZpZykge31cblxuICAvKipcbiAgICogT3BlbnMgYSBuZXcgbW9kYWwgd2luZG93IHdpdGggdGhlIHNwZWNpZmllZCBjb250ZW50IGFuZCB1c2luZyBzdXBwbGllZCBvcHRpb25zLiBDb250ZW50IGNhbiBiZSBwcm92aWRlZFxuICAgKiBhcyBhIFRlbXBsYXRlUmVmIG9yIGEgY29tcG9uZW50IHR5cGUuIElmIHlvdSBwYXNzIGEgY29tcG9uZW50IHR5cGUgYXMgY29udGVudCB0aGFuIGluc3RhbmNlcyBvZiB0aG9zZVxuICAgKiBjb21wb25lbnRzIGNhbiBiZSBpbmplY3RlZCB3aXRoIGFuIGluc3RhbmNlIG9mIHRoZSBOZ2JBY3RpdmVNb2RhbCBjbGFzcy4gWW91IGNhbiB1c2UgbWV0aG9kcyBvbiB0aGVcbiAgICogTmdiQWN0aXZlTW9kYWwgY2xhc3MgdG8gY2xvc2UgLyBkaXNtaXNzIG1vZGFscyBmcm9tIFwiaW5zaWRlXCIgb2YgYSBjb21wb25lbnQuXG4gICAqL1xuICBvcGVuKGNvbnRlbnQ6IGFueSwgb3B0aW9uczogTmdiTW9kYWxPcHRpb25zID0ge30pOiBOZ2JNb2RhbFJlZiB7XG4gICAgY29uc3QgY29tYmluZWRPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fY29uZmlnLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5fbW9kYWxTdGFjay5vcGVuKHRoaXMuX21vZHVsZUNGUiwgdGhpcy5faW5qZWN0b3IsIGNvbnRlbnQsIGNvbWJpbmVkT3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzcyBhbGwgY3VycmVudGx5IGRpc3BsYXllZCBtb2RhbCB3aW5kb3dzIHdpdGggdGhlIHN1cHBsaWVkIHJlYXNvbi5cbiAgICpcbiAgICogQHNpbmNlIDMuMS4wXG4gICAqL1xuICBkaXNtaXNzQWxsKHJlYXNvbj86IGFueSkgeyB0aGlzLl9tb2RhbFN0YWNrLmRpc21pc3NBbGwocmVhc29uKTsgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgdGhlcmUgYXJlIGN1cnJlbnRseSBhbnkgb3BlbiBtb2RhbCB3aW5kb3dzIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQHNpbmNlIDMuMy4wXG4gICAqL1xuICBoYXNPcGVuTW9kYWxzKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fbW9kYWxTdGFjay5oYXNPcGVuTW9kYWxzKCk7IH1cbn1cbiIsImltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge05nYk1vZGFsfSBmcm9tICcuL21vZGFsJztcbmltcG9ydCB7TmdiTW9kYWxCYWNrZHJvcH0gZnJvbSAnLi9tb2RhbC1iYWNrZHJvcCc7XG5pbXBvcnQge05nYk1vZGFsV2luZG93fSBmcm9tICcuL21vZGFsLXdpbmRvdyc7XG5cbmV4cG9ydCB7TmdiTW9kYWx9IGZyb20gJy4vbW9kYWwnO1xuZXhwb3J0IHtOZ2JNb2RhbENvbmZpZywgTmdiTW9kYWxPcHRpb25zfSBmcm9tICcuL21vZGFsLWNvbmZpZyc7XG5leHBvcnQge05nYk1vZGFsUmVmLCBOZ2JBY3RpdmVNb2RhbH0gZnJvbSAnLi9tb2RhbC1yZWYnO1xuZXhwb3J0IHtNb2RhbERpc21pc3NSZWFzb25zfSBmcm9tICcuL21vZGFsLWRpc21pc3MtcmVhc29ucyc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW05nYk1vZGFsQmFja2Ryb3AsIE5nYk1vZGFsV2luZG93XSxcbiAgZW50cnlDb21wb25lbnRzOiBbTmdiTW9kYWxCYWNrZHJvcCwgTmdiTW9kYWxXaW5kb3ddLFxuICBwcm92aWRlcnM6IFtOZ2JNb2RhbF1cbn0pXG5leHBvcnQgY2xhc3MgTmdiTW9kYWxNb2R1bGUge1xuICAvKipcbiAgICogSW1wb3J0aW5nIHdpdGggJy5mb3JSb290KCknIGlzIG5vIGxvbmdlciBuZWNlc3NhcnksIHlvdSBjYW4gc2ltcGx5IGltcG9ydCB0aGUgbW9kdWxlLlxuICAgKiBXaWxsIGJlIHJlbW92ZWQgaW4gNC4wLjAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiTW9kYWxNb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIE5nYlBhZ2luYXRpb24gY29tcG9uZW50LlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIHBhZ2luYXRpb25zIHVzZWQgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JQYWdpbmF0aW9uQ29uZmlnIHtcbiAgZGlzYWJsZWQgPSBmYWxzZTtcbiAgYm91bmRhcnlMaW5rcyA9IGZhbHNlO1xuICBkaXJlY3Rpb25MaW5rcyA9IHRydWU7XG4gIGVsbGlwc2VzID0gdHJ1ZTtcbiAgbWF4U2l6ZSA9IDA7XG4gIHBhZ2VTaXplID0gMTA7XG4gIHJvdGF0ZSA9IGZhbHNlO1xuICBzaXplOiAnc20nIHwgJ2xnJztcbn1cbiIsImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQsIE9uQ2hhbmdlcywgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFNpbXBsZUNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtnZXRWYWx1ZUluUmFuZ2UsIGlzTnVtYmVyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JQYWdpbmF0aW9uQ29uZmlnfSBmcm9tICcuL3BhZ2luYXRpb24tY29uZmlnJztcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IHdpbGwgdGFrZSBjYXJlIG9mIHZpc3VhbGlzaW5nIGEgcGFnaW5hdGlvbiBiYXIgYW5kIGVuYWJsZSAvIGRpc2FibGUgYnV0dG9ucyBjb3JyZWN0bHkhXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1wYWdpbmF0aW9uJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHsncm9sZSc6ICduYXZpZ2F0aW9uJ30sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsIFtjbGFzc109XCIncGFnaW5hdGlvbicgKyAoc2l6ZSA/ICcgcGFnaW5hdGlvbi0nICsgc2l6ZSA6ICcnKVwiPlxuICAgICAgPGxpICpuZ0lmPVwiYm91bmRhcnlMaW5rc1wiIGNsYXNzPVwicGFnZS1pdGVtXCJcbiAgICAgICAgW2NsYXNzLmRpc2FibGVkXT1cIiFoYXNQcmV2aW91cygpIHx8IGRpc2FibGVkXCI+XG4gICAgICAgIDxhIGFyaWEtbGFiZWw9XCJGaXJzdFwiIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLnBhZ2luYXRpb24uZmlyc3QtYXJpYVwiIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZlxuICAgICAgICAgIChjbGljayk9XCJzZWxlY3RQYWdlKDEpOyAkZXZlbnQucHJldmVudERlZmF1bHQoKVwiIFthdHRyLnRhYmluZGV4XT1cIihoYXNQcmV2aW91cygpID8gbnVsbCA6ICctMScpXCI+XG4gICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgaTE4bj1cIkBAbmdiLnBhZ2luYXRpb24uZmlyc3RcIj4mbGFxdW87JmxhcXVvOzwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cblxuICAgICAgPGxpICpuZ0lmPVwiZGlyZWN0aW9uTGlua3NcIiBjbGFzcz1cInBhZ2UtaXRlbVwiXG4gICAgICAgIFtjbGFzcy5kaXNhYmxlZF09XCIhaGFzUHJldmlvdXMoKSB8fCBkaXNhYmxlZFwiPlxuICAgICAgICA8YSBhcmlhLWxhYmVsPVwiUHJldmlvdXNcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi5wYWdpbmF0aW9uLnByZXZpb3VzLWFyaWFcIiBjbGFzcz1cInBhZ2UtbGlua1wiIGhyZWZcbiAgICAgICAgICAoY2xpY2spPVwic2VsZWN0UGFnZShwYWdlLTEpOyAkZXZlbnQucHJldmVudERlZmF1bHQoKVwiIFthdHRyLnRhYmluZGV4XT1cIihoYXNQcmV2aW91cygpID8gbnVsbCA6ICctMScpXCI+XG4gICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgaTE4bj1cIkBAbmdiLnBhZ2luYXRpb24ucHJldmlvdXNcIj4mbGFxdW87PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICAgPGxpICpuZ0Zvcj1cImxldCBwYWdlTnVtYmVyIG9mIHBhZ2VzXCIgY2xhc3M9XCJwYWdlLWl0ZW1cIiBbY2xhc3MuYWN0aXZlXT1cInBhZ2VOdW1iZXIgPT09IHBhZ2VcIlxuICAgICAgICBbY2xhc3MuZGlzYWJsZWRdPVwiaXNFbGxpcHNpcyhwYWdlTnVtYmVyKSB8fCBkaXNhYmxlZFwiPlxuICAgICAgICA8YSAqbmdJZj1cImlzRWxsaXBzaXMocGFnZU51bWJlcilcIiBjbGFzcz1cInBhZ2UtbGlua1wiPi4uLjwvYT5cbiAgICAgICAgPGEgKm5nSWY9XCIhaXNFbGxpcHNpcyhwYWdlTnVtYmVyKVwiIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZiAoY2xpY2spPVwic2VsZWN0UGFnZShwYWdlTnVtYmVyKTsgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcIj5cbiAgICAgICAgICB7e3BhZ2VOdW1iZXJ9fVxuICAgICAgICAgIDxzcGFuICpuZ0lmPVwicGFnZU51bWJlciA9PT0gcGFnZVwiIGNsYXNzPVwic3Itb25seVwiPihjdXJyZW50KTwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICAgIDxsaSAqbmdJZj1cImRpcmVjdGlvbkxpbmtzXCIgY2xhc3M9XCJwYWdlLWl0ZW1cIiBbY2xhc3MuZGlzYWJsZWRdPVwiIWhhc05leHQoKSB8fCBkaXNhYmxlZFwiPlxuICAgICAgICA8YSBhcmlhLWxhYmVsPVwiTmV4dFwiIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLnBhZ2luYXRpb24ubmV4dC1hcmlhXCIgY2xhc3M9XCJwYWdlLWxpbmtcIiBocmVmXG4gICAgICAgICAgKGNsaWNrKT1cInNlbGVjdFBhZ2UocGFnZSsxKTsgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcIiBbYXR0ci50YWJpbmRleF09XCIoaGFzTmV4dCgpID8gbnVsbCA6ICctMScpXCI+XG4gICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgaTE4bj1cIkBAbmdiLnBhZ2luYXRpb24ubmV4dFwiPiZyYXF1bzs8L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG5cbiAgICAgIDxsaSAqbmdJZj1cImJvdW5kYXJ5TGlua3NcIiBjbGFzcz1cInBhZ2UtaXRlbVwiIFtjbGFzcy5kaXNhYmxlZF09XCIhaGFzTmV4dCgpIHx8IGRpc2FibGVkXCI+XG4gICAgICAgIDxhIGFyaWEtbGFiZWw9XCJMYXN0XCIgaTE4bi1hcmlhLWxhYmVsPVwiQEBuZ2IucGFnaW5hdGlvbi5sYXN0LWFyaWFcIiBjbGFzcz1cInBhZ2UtbGlua1wiIGhyZWZcbiAgICAgICAgICAoY2xpY2spPVwic2VsZWN0UGFnZShwYWdlQ291bnQpOyAkZXZlbnQucHJldmVudERlZmF1bHQoKVwiIFthdHRyLnRhYmluZGV4XT1cIihoYXNOZXh0KCkgPyBudWxsIDogJy0xJylcIj5cbiAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBpMThuPVwiQEBuZ2IucGFnaW5hdGlvbi5sYXN0XCI+JnJhcXVvOyZyYXF1bzs8L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JQYWdpbmF0aW9uIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgcGFnZUNvdW50ID0gMDtcbiAgcGFnZXM6IG51bWJlcltdID0gW107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzYWJsZSBidXR0b25zIGZyb20gdXNlciBpbnB1dFxuICAgKi9cbiAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqICBXaGV0aGVyIHRvIHNob3cgdGhlIFwiRmlyc3RcIiBhbmQgXCJMYXN0XCIgcGFnZSBsaW5rc1xuICAgKi9cbiAgQElucHV0KCkgYm91bmRhcnlMaW5rczogYm9vbGVhbjtcblxuICAvKipcbiAgICogIFdoZXRoZXIgdG8gc2hvdyB0aGUgXCJOZXh0XCIgYW5kIFwiUHJldmlvdXNcIiBwYWdlIGxpbmtzXG4gICAqL1xuICBASW5wdXQoKSBkaXJlY3Rpb25MaW5rczogYm9vbGVhbjtcblxuICAvKipcbiAgICogIFdoZXRoZXIgdG8gc2hvdyBlbGxpcHNpcyBzeW1ib2xzIGFuZCBmaXJzdC9sYXN0IHBhZ2UgbnVtYmVycyB3aGVuIG1heFNpemUgPiBudW1iZXIgb2YgcGFnZXNcbiAgICovXG4gIEBJbnB1dCgpIGVsbGlwc2VzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiAgV2hldGhlciB0byByb3RhdGUgcGFnZXMgd2hlbiBtYXhTaXplID4gbnVtYmVyIG9mIHBhZ2VzLlxuICAgKiAgQ3VycmVudCBwYWdlIHdpbGwgYmUgaW4gdGhlIG1pZGRsZVxuICAgKi9cbiAgQElucHV0KCkgcm90YXRlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiAgTnVtYmVyIG9mIGl0ZW1zIGluIGNvbGxlY3Rpb24uXG4gICAqL1xuICBASW5wdXQoKSBjb2xsZWN0aW9uU2l6ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiAgTWF4aW11bSBudW1iZXIgb2YgcGFnZXMgdG8gZGlzcGxheS5cbiAgICovXG4gIEBJbnB1dCgpIG1heFNpemU6IG51bWJlcjtcblxuICAvKipcbiAgICogIEN1cnJlbnQgcGFnZS4gUGFnZSBudW1iZXJzIHN0YXJ0IHdpdGggMVxuICAgKi9cbiAgQElucHV0KCkgcGFnZSA9IDE7XG5cbiAgLyoqXG4gICAqICBOdW1iZXIgb2YgaXRlbXMgcGVyIHBhZ2UuXG4gICAqL1xuICBASW5wdXQoKSBwYWdlU2l6ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiAgQW4gZXZlbnQgZmlyZWQgd2hlbiB0aGUgcGFnZSBpcyBjaGFuZ2VkLlxuICAgKiAgRXZlbnQncyBwYXlsb2FkIGVxdWFscyB0byB0aGUgbmV3bHkgc2VsZWN0ZWQgcGFnZS5cbiAgICogIFdpbGwgZmlyZSBvbmx5IGlmIGNvbGxlY3Rpb24gc2l6ZSBpcyBzZXQgYW5kIGFsbCB2YWx1ZXMgYXJlIHZhbGlkLlxuICAgKiAgUGFnZSBudW1iZXJzIHN0YXJ0IHdpdGggMVxuICAgKi9cbiAgQE91dHB1dCgpIHBhZ2VDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4odHJ1ZSk7XG5cbiAgLyoqXG4gICAqIFBhZ2luYXRpb24gZGlzcGxheSBzaXplOiBzbWFsbCBvciBsYXJnZVxuICAgKi9cbiAgQElucHV0KCkgc2l6ZTogJ3NtJyB8ICdsZyc7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBOZ2JQYWdpbmF0aW9uQ29uZmlnKSB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGNvbmZpZy5kaXNhYmxlZDtcbiAgICB0aGlzLmJvdW5kYXJ5TGlua3MgPSBjb25maWcuYm91bmRhcnlMaW5rcztcbiAgICB0aGlzLmRpcmVjdGlvbkxpbmtzID0gY29uZmlnLmRpcmVjdGlvbkxpbmtzO1xuICAgIHRoaXMuZWxsaXBzZXMgPSBjb25maWcuZWxsaXBzZXM7XG4gICAgdGhpcy5tYXhTaXplID0gY29uZmlnLm1heFNpemU7XG4gICAgdGhpcy5wYWdlU2l6ZSA9IGNvbmZpZy5wYWdlU2l6ZTtcbiAgICB0aGlzLnJvdGF0ZSA9IGNvbmZpZy5yb3RhdGU7XG4gICAgdGhpcy5zaXplID0gY29uZmlnLnNpemU7XG4gIH1cblxuICBoYXNQcmV2aW91cygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucGFnZSA+IDE7IH1cblxuICBoYXNOZXh0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5wYWdlIDwgdGhpcy5wYWdlQ291bnQ7IH1cblxuICBzZWxlY3RQYWdlKHBhZ2VOdW1iZXI6IG51bWJlcik6IHZvaWQgeyB0aGlzLl91cGRhdGVQYWdlcyhwYWdlTnVtYmVyKTsgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHsgdGhpcy5fdXBkYXRlUGFnZXModGhpcy5wYWdlKTsgfVxuXG4gIGlzRWxsaXBzaXMocGFnZU51bWJlcik6IGJvb2xlYW4geyByZXR1cm4gcGFnZU51bWJlciA9PT0gLTE7IH1cblxuICAvKipcbiAgICogQXBwZW5kcyBlbGxpcHNlcyBhbmQgZmlyc3QvbGFzdCBwYWdlIG51bWJlciB0byB0aGUgZGlzcGxheWVkIHBhZ2VzXG4gICAqL1xuICBwcml2YXRlIF9hcHBseUVsbGlwc2VzKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuZWxsaXBzZXMpIHtcbiAgICAgIGlmIChzdGFydCA+IDApIHtcbiAgICAgICAgaWYgKHN0YXJ0ID4gMSkge1xuICAgICAgICAgIHRoaXMucGFnZXMudW5zaGlmdCgtMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWdlcy51bnNoaWZ0KDEpO1xuICAgICAgfVxuICAgICAgaWYgKGVuZCA8IHRoaXMucGFnZUNvdW50KSB7XG4gICAgICAgIGlmIChlbmQgPCAodGhpcy5wYWdlQ291bnQgLSAxKSkge1xuICAgICAgICAgIHRoaXMucGFnZXMucHVzaCgtMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWdlcy5wdXNoKHRoaXMucGFnZUNvdW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUm90YXRlcyBwYWdlIG51bWJlcnMgYmFzZWQgb24gbWF4U2l6ZSBpdGVtcyB2aXNpYmxlLlxuICAgKiBDdXJyZW50bHkgc2VsZWN0ZWQgcGFnZSBzdGF5cyBpbiB0aGUgbWlkZGxlOlxuICAgKlxuICAgKiBFeC4gZm9yIHNlbGVjdGVkIHBhZ2UgPSA2OlxuICAgKiBbNSwqNiosN10gZm9yIG1heFNpemUgPSAzXG4gICAqIFs0LDUsKjYqLDddIGZvciBtYXhTaXplID0gNFxuICAgKi9cbiAgcHJpdmF0ZSBfYXBwbHlSb3RhdGlvbigpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICBsZXQgc3RhcnQgPSAwO1xuICAgIGxldCBlbmQgPSB0aGlzLnBhZ2VDb3VudDtcbiAgICBsZXQgbGVmdE9mZnNldCA9IE1hdGguZmxvb3IodGhpcy5tYXhTaXplIC8gMik7XG4gICAgbGV0IHJpZ2h0T2Zmc2V0ID0gdGhpcy5tYXhTaXplICUgMiA9PT0gMCA/IGxlZnRPZmZzZXQgLSAxIDogbGVmdE9mZnNldDtcblxuICAgIGlmICh0aGlzLnBhZ2UgPD0gbGVmdE9mZnNldCkge1xuICAgICAgLy8gdmVyeSBiZWdpbm5pbmcsIG5vIHJvdGF0aW9uIC0+IFswLi5tYXhTaXplXVxuICAgICAgZW5kID0gdGhpcy5tYXhTaXplO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYWdlQ291bnQgLSB0aGlzLnBhZ2UgPCBsZWZ0T2Zmc2V0KSB7XG4gICAgICAvLyB2ZXJ5IGVuZCwgbm8gcm90YXRpb24gLT4gW2xlbi1tYXhTaXplLi5sZW5dXG4gICAgICBzdGFydCA9IHRoaXMucGFnZUNvdW50IC0gdGhpcy5tYXhTaXplO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyByb3RhdGVcbiAgICAgIHN0YXJ0ID0gdGhpcy5wYWdlIC0gbGVmdE9mZnNldCAtIDE7XG4gICAgICBlbmQgPSB0aGlzLnBhZ2UgKyByaWdodE9mZnNldDtcbiAgICB9XG5cbiAgICByZXR1cm4gW3N0YXJ0LCBlbmRdO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhZ2luYXRlcyBwYWdlIG51bWJlcnMgYmFzZWQgb24gbWF4U2l6ZSBpdGVtcyBwZXIgcGFnZVxuICAgKi9cbiAgcHJpdmF0ZSBfYXBwbHlQYWdpbmF0aW9uKCk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgIGxldCBwYWdlID0gTWF0aC5jZWlsKHRoaXMucGFnZSAvIHRoaXMubWF4U2l6ZSkgLSAxO1xuICAgIGxldCBzdGFydCA9IHBhZ2UgKiB0aGlzLm1heFNpemU7XG4gICAgbGV0IGVuZCA9IHN0YXJ0ICsgdGhpcy5tYXhTaXplO1xuXG4gICAgcmV0dXJuIFtzdGFydCwgZW5kXTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldFBhZ2VJblJhbmdlKG5ld1BhZ2VObykge1xuICAgIGNvbnN0IHByZXZQYWdlTm8gPSB0aGlzLnBhZ2U7XG4gICAgdGhpcy5wYWdlID0gZ2V0VmFsdWVJblJhbmdlKG5ld1BhZ2VObywgdGhpcy5wYWdlQ291bnQsIDEpO1xuXG4gICAgaWYgKHRoaXMucGFnZSAhPT0gcHJldlBhZ2VObyAmJiBpc051bWJlcih0aGlzLmNvbGxlY3Rpb25TaXplKSkge1xuICAgICAgdGhpcy5wYWdlQ2hhbmdlLmVtaXQodGhpcy5wYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVQYWdlcyhuZXdQYWdlOiBudW1iZXIpIHtcbiAgICB0aGlzLnBhZ2VDb3VudCA9IE1hdGguY2VpbCh0aGlzLmNvbGxlY3Rpb25TaXplIC8gdGhpcy5wYWdlU2l6ZSk7XG5cbiAgICBpZiAoIWlzTnVtYmVyKHRoaXMucGFnZUNvdW50KSkge1xuICAgICAgdGhpcy5wYWdlQ291bnQgPSAwO1xuICAgIH1cblxuICAgIC8vIGZpbGwtaW4gbW9kZWwgbmVlZGVkIHRvIHJlbmRlciBwYWdlc1xuICAgIHRoaXMucGFnZXMubGVuZ3RoID0gMDtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLnBhZ2VDb3VudDsgaSsrKSB7XG4gICAgICB0aGlzLnBhZ2VzLnB1c2goaSk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHBhZ2Ugd2l0aGluIDEuLm1heCByYW5nZVxuICAgIHRoaXMuX3NldFBhZ2VJblJhbmdlKG5ld1BhZ2UpO1xuXG4gICAgLy8gYXBwbHkgbWF4U2l6ZSBpZiBuZWNlc3NhcnlcbiAgICBpZiAodGhpcy5tYXhTaXplID4gMCAmJiB0aGlzLnBhZ2VDb3VudCA+IHRoaXMubWF4U2l6ZSkge1xuICAgICAgbGV0IHN0YXJ0ID0gMDtcbiAgICAgIGxldCBlbmQgPSB0aGlzLnBhZ2VDb3VudDtcblxuICAgICAgLy8gZWl0aGVyIHBhZ2luYXRpbmcgb3Igcm90YXRpbmcgcGFnZSBudW1iZXJzXG4gICAgICBpZiAodGhpcy5yb3RhdGUpIHtcbiAgICAgICAgW3N0YXJ0LCBlbmRdID0gdGhpcy5fYXBwbHlSb3RhdGlvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgW3N0YXJ0LCBlbmRdID0gdGhpcy5fYXBwbHlQYWdpbmF0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFnZXMgPSB0aGlzLnBhZ2VzLnNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgICAvLyBhZGRpbmcgZWxsaXBzZXNcbiAgICAgIHRoaXMuX2FwcGx5RWxsaXBzZXMoc3RhcnQsIGVuZCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge05nYlBhZ2luYXRpb259IGZyb20gJy4vcGFnaW5hdGlvbic7XG5cbmV4cG9ydCB7TmdiUGFnaW5hdGlvbn0gZnJvbSAnLi9wYWdpbmF0aW9uJztcbmV4cG9ydCB7TmdiUGFnaW5hdGlvbkNvbmZpZ30gZnJvbSAnLi9wYWdpbmF0aW9uLWNvbmZpZyc7XG5cbkBOZ01vZHVsZSh7ZGVjbGFyYXRpb25zOiBbTmdiUGFnaW5hdGlvbl0sIGV4cG9ydHM6IFtOZ2JQYWdpbmF0aW9uXSwgaW1wb3J0czogW0NvbW1vbk1vZHVsZV19KVxuZXhwb3J0IGNsYXNzIE5nYlBhZ2luYXRpb25Nb2R1bGUge1xuICAvKipcbiAgICogSW1wb3J0aW5nIHdpdGggJy5mb3JSb290KCknIGlzIG5vIGxvbmdlciBuZWNlc3NhcnksIHlvdSBjYW4gc2ltcGx5IGltcG9ydCB0aGUgbW9kdWxlLlxuICAgKiBXaWxsIGJlIHJlbW92ZWQgaW4gNC4wLjAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiUGFnaW5hdGlvbk1vZHVsZX07IH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUcmlnZ2VyIHtcbiAgY29uc3RydWN0b3IocHVibGljIG9wZW46IHN0cmluZywgcHVibGljIGNsb3NlPzogc3RyaW5nKSB7XG4gICAgaWYgKCFjbG9zZSkge1xuICAgICAgdGhpcy5jbG9zZSA9IG9wZW47XG4gICAgfVxuICB9XG5cbiAgaXNNYW51YWwoKSB7IHJldHVybiB0aGlzLm9wZW4gPT09ICdtYW51YWwnIHx8IHRoaXMuY2xvc2UgPT09ICdtYW51YWwnOyB9XG59XG5cbmNvbnN0IERFRkFVTFRfQUxJQVNFUyA9IHtcbiAgJ2hvdmVyJzogWydtb3VzZWVudGVyJywgJ21vdXNlbGVhdmUnXVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJpZ2dlcnModHJpZ2dlcnM6IHN0cmluZywgYWxpYXNlcyA9IERFRkFVTFRfQUxJQVNFUyk6IFRyaWdnZXJbXSB7XG4gIGNvbnN0IHRyaW1tZWRUcmlnZ2VycyA9ICh0cmlnZ2VycyB8fCAnJykudHJpbSgpO1xuXG4gIGlmICh0cmltbWVkVHJpZ2dlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgcGFyc2VkVHJpZ2dlcnMgPSB0cmltbWVkVHJpZ2dlcnMuc3BsaXQoL1xccysvKS5tYXAodHJpZ2dlciA9PiB0cmlnZ2VyLnNwbGl0KCc6JykpLm1hcCgodHJpZ2dlclBhaXIpID0+IHtcbiAgICBsZXQgYWxpYXMgPSBhbGlhc2VzW3RyaWdnZXJQYWlyWzBdXSB8fCB0cmlnZ2VyUGFpcjtcbiAgICByZXR1cm4gbmV3IFRyaWdnZXIoYWxpYXNbMF0sIGFsaWFzWzFdKTtcbiAgfSk7XG5cbiAgY29uc3QgbWFudWFsVHJpZ2dlcnMgPSBwYXJzZWRUcmlnZ2Vycy5maWx0ZXIodHJpZ2dlclBhaXIgPT4gdHJpZ2dlclBhaXIuaXNNYW51YWwoKSk7XG5cbiAgaWYgKG1hbnVhbFRyaWdnZXJzLmxlbmd0aCA+IDEpIHtcbiAgICB0aHJvdyAnVHJpZ2dlcnMgcGFyc2UgZXJyb3I6IG9ubHkgb25lIG1hbnVhbCB0cmlnZ2VyIGlzIGFsbG93ZWQnO1xuICB9XG5cbiAgaWYgKG1hbnVhbFRyaWdnZXJzLmxlbmd0aCA9PT0gMSAmJiBwYXJzZWRUcmlnZ2Vycy5sZW5ndGggPiAxKSB7XG4gICAgdGhyb3cgJ1RyaWdnZXJzIHBhcnNlIGVycm9yOiBtYW51YWwgdHJpZ2dlciBjYW5cXCd0IGJlIG1peGVkIHdpdGggb3RoZXIgdHJpZ2dlcnMnO1xuICB9XG5cbiAgcmV0dXJuIHBhcnNlZFRyaWdnZXJzO1xufVxuXG5jb25zdCBub29wRm4gPSAoKSA9PiB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlblRvVHJpZ2dlcnMocmVuZGVyZXI6IGFueSwgbmF0aXZlRWxlbWVudDogYW55LCB0cmlnZ2Vyczogc3RyaW5nLCBvcGVuRm4sIGNsb3NlRm4sIHRvZ2dsZUZuKSB7XG4gIGNvbnN0IHBhcnNlZFRyaWdnZXJzID0gcGFyc2VUcmlnZ2Vycyh0cmlnZ2Vycyk7XG4gIGNvbnN0IGxpc3RlbmVycyA9IFtdO1xuXG4gIGlmIChwYXJzZWRUcmlnZ2Vycy5sZW5ndGggPT09IDEgJiYgcGFyc2VkVHJpZ2dlcnNbMF0uaXNNYW51YWwoKSkge1xuICAgIHJldHVybiBub29wRm47XG4gIH1cblxuICBwYXJzZWRUcmlnZ2Vycy5mb3JFYWNoKCh0cmlnZ2VyOiBUcmlnZ2VyKSA9PiB7XG4gICAgaWYgKHRyaWdnZXIub3BlbiA9PT0gdHJpZ2dlci5jbG9zZSkge1xuICAgICAgbGlzdGVuZXJzLnB1c2gocmVuZGVyZXIubGlzdGVuKG5hdGl2ZUVsZW1lbnQsIHRyaWdnZXIub3BlbiwgdG9nZ2xlRm4pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdGVuZXJzLnB1c2goXG4gICAgICAgICAgcmVuZGVyZXIubGlzdGVuKG5hdGl2ZUVsZW1lbnQsIHRyaWdnZXIub3Blbiwgb3BlbkZuKSwgcmVuZGVyZXIubGlzdGVuKG5hdGl2ZUVsZW1lbnQsIHRyaWdnZXIuY2xvc2UsIGNsb3NlRm4pKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiAoKSA9PiB7IGxpc3RlbmVycy5mb3JFYWNoKHVuc3Vic2NyaWJlRm4gPT4gdW5zdWJzY3JpYmVGbigpKTsgfTtcbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsYWNlbWVudEFycmF5fSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHNlcnZpY2UgZm9yIHRoZSBOZ2JQb3BvdmVyIGRpcmVjdGl2ZS5cbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSBwb3BvdmVycyB1c2VkIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiUG9wb3ZlckNvbmZpZyB7XG4gIGF1dG9DbG9zZTogYm9vbGVhbiB8ICdpbnNpZGUnIHwgJ291dHNpZGUnID0gdHJ1ZTtcbiAgcGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSA9ICd0b3AnO1xuICB0cmlnZ2VycyA9ICdjbGljayc7XG4gIGNvbnRhaW5lcjogc3RyaW5nO1xuICBkaXNhYmxlUG9wb3ZlciA9IGZhbHNlO1xuICBwb3BvdmVyQ2xhc3M6IHN0cmluZztcbn1cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgT25DaGFuZ2VzLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBSZW5kZXJlcjIsXG4gIENvbXBvbmVudFJlZixcbiAgRWxlbWVudFJlZixcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgTmdab25lLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge2Zyb21FdmVudCwgcmFjZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7bGlzdGVuVG9UcmlnZ2Vyc30gZnJvbSAnLi4vdXRpbC90cmlnZ2Vycyc7XG5pbXBvcnQge3Bvc2l0aW9uRWxlbWVudHMsIFBsYWNlbWVudCwgUGxhY2VtZW50QXJyYXl9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmcnO1xuaW1wb3J0IHtQb3B1cFNlcnZpY2V9IGZyb20gJy4uL3V0aWwvcG9wdXAnO1xuaW1wb3J0IHtLZXl9IGZyb20gJy4uL3V0aWwva2V5JztcblxuaW1wb3J0IHtOZ2JQb3BvdmVyQ29uZmlnfSBmcm9tICcuL3BvcG92ZXItY29uZmlnJztcblxubGV0IG5leHRJZCA9IDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1wb3BvdmVyLXdpbmRvdycsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzc10nOlxuICAgICAgICAnXCJwb3BvdmVyIGJzLXBvcG92ZXItXCIgKyBwbGFjZW1lbnQuc3BsaXQoXCItXCIpWzBdK1wiIGJzLXBvcG92ZXItXCIgKyBwbGFjZW1lbnQgKyAocG9wb3ZlckNsYXNzID8gXCIgXCIgKyBwb3BvdmVyQ2xhc3MgOiBcIlwiKScsXG4gICAgJ3JvbGUnOiAndG9vbHRpcCcsXG4gICAgJ1tpZF0nOiAnaWQnXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImFycm93XCI+PC9kaXY+XG4gICAgPGgzIGNsYXNzPVwicG9wb3Zlci1oZWFkZXJcIiAqbmdJZj1cInRpdGxlICE9IG51bGxcIj5cbiAgICAgIDxuZy10ZW1wbGF0ZSAjc2ltcGxlVGl0bGU+e3t0aXRsZX19PC9uZy10ZW1wbGF0ZT5cbiAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJpc1RpdGxlVGVtcGxhdGUoKSA/IHRpdGxlIDogc2ltcGxlVGl0bGVcIiBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiY29udGV4dFwiPjwvbmctdGVtcGxhdGU+XG4gICAgPC9oMz5cbiAgICA8ZGl2IGNsYXNzPVwicG9wb3Zlci1ib2R5XCI+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvZGl2PmAsXG4gIHN0eWxlVXJsczogWycuL3BvcG92ZXIuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5nYlBvcG92ZXJXaW5kb3cge1xuICBASW5wdXQoKSBwbGFjZW1lbnQ6IFBsYWNlbWVudCA9ICd0b3AnO1xuICBASW5wdXQoKSB0aXRsZTogdW5kZWZpbmVkIHwgc3RyaW5nIHwgVGVtcGxhdGVSZWY8YW55PjtcbiAgQElucHV0KCkgaWQ6IHN0cmluZztcbiAgQElucHV0KCkgcG9wb3ZlckNsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGNvbnRleHQ6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMikge31cblxuICBpc1RpdGxlVGVtcGxhdGUoKSB7IHJldHVybiB0aGlzLnRpdGxlIGluc3RhbmNlb2YgVGVtcGxhdGVSZWY7IH1cblxuICBhcHBseVBsYWNlbWVudChfcGxhY2VtZW50OiBQbGFjZW1lbnQpIHtcbiAgICAvLyByZW1vdmUgdGhlIGN1cnJlbnQgcGxhY2VtZW50IGNsYXNzZXNcbiAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdicy1wb3BvdmVyLScgKyB0aGlzLnBsYWNlbWVudC50b1N0cmluZygpLnNwbGl0KCctJylbMF0pO1xuICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2JzLXBvcG92ZXItJyArIHRoaXMucGxhY2VtZW50LnRvU3RyaW5nKCkpO1xuXG4gICAgLy8gc2V0IHRoZSBuZXcgcGxhY2VtZW50IGNsYXNzZXNcbiAgICB0aGlzLnBsYWNlbWVudCA9IF9wbGFjZW1lbnQ7XG5cbiAgICAvLyBhcHBseSB0aGUgbmV3IHBsYWNlbWVudFxuICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2JzLXBvcG92ZXItJyArIHRoaXMucGxhY2VtZW50LnRvU3RyaW5nKCkuc3BsaXQoJy0nKVswXSk7XG4gICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnYnMtcG9wb3Zlci0nICsgdGhpcy5wbGFjZW1lbnQudG9TdHJpbmcoKSk7XG4gIH1cblxuICAvKipcbiAgICogVGVsbHMgd2hldGhlciB0aGUgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkIGZyb20gdGhpcyBjb21wb25lbnQncyBzdWJ0cmVlIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IHRoZSBldmVudCB0byBjaGVja1xuICAgKlxuICAgKiBAcmV0dXJuIHdoZXRoZXIgdGhlIGV2ZW50IGhhcyBiZWVuIHRyaWdnZXJlZCBmcm9tIHRoaXMgY29tcG9uZW50J3Mgc3VidHJlZSBvciBub3QuXG4gICAqL1xuICBpc0V2ZW50RnJvbShldmVudDogRXZlbnQpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpOyB9XG59XG5cbi8qKlxuICogQSBsaWdodHdlaWdodCwgZXh0ZW5zaWJsZSBkaXJlY3RpdmUgZm9yIGZhbmN5IHBvcG92ZXIgY3JlYXRpb24uXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW25nYlBvcG92ZXJdJywgZXhwb3J0QXM6ICduZ2JQb3BvdmVyJ30pXG5leHBvcnQgY2xhc3MgTmdiUG9wb3ZlciBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHBvcG92ZXIgc2hvdWxkIGJlIGNsb3NlZCBvbiBFc2NhcGUga2V5IGFuZCBpbnNpZGUvb3V0c2lkZSBjbGlja3MuXG4gICAqXG4gICAqIC0gdHJ1ZSAoZGVmYXVsdCk6IGNsb3NlcyBvbiBib3RoIG91dHNpZGUgYW5kIGluc2lkZSBjbGlja3MgYXMgd2VsbCBhcyBFc2NhcGUgcHJlc3Nlc1xuICAgKiAtIGZhbHNlOiBkaXNhYmxlcyB0aGUgYXV0b0Nsb3NlIGZlYXR1cmUgKE5COiB0cmlnZ2VycyBzdGlsbCBhcHBseSlcbiAgICogLSAnaW5zaWRlJzogY2xvc2VzIG9uIGluc2lkZSBjbGlja3MgYXMgd2VsbCBhcyBFc2NhcGUgcHJlc3Nlc1xuICAgKiAtICdvdXRzaWRlJzogY2xvc2VzIG9uIG91dHNpZGUgY2xpY2tzIChzb21ldGltZXMgYWxzbyBhY2hpZXZhYmxlIHRocm91Z2ggdHJpZ2dlcnMpXG4gICAqIGFzIHdlbGwgYXMgRXNjYXBlIHByZXNzZXNcbiAgICpcbiAgICogQHNpbmNlIDMuMC4wXG4gICAqL1xuICBASW5wdXQoKSBhdXRvQ2xvc2U6IGJvb2xlYW4gfCAnaW5zaWRlJyB8ICdvdXRzaWRlJztcbiAgLyoqXG4gICAqIENvbnRlbnQgdG8gYmUgZGlzcGxheWVkIGFzIHBvcG92ZXIuIElmIHRpdGxlIGFuZCBjb250ZW50IGFyZSBlbXB0eSwgdGhlIHBvcG92ZXIgd29uJ3Qgb3Blbi5cbiAgICovXG4gIEBJbnB1dCgpIG5nYlBvcG92ZXI6IHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT47XG4gIC8qKlxuICAgKiBUaXRsZSBvZiBhIHBvcG92ZXIuIElmIHRpdGxlIGFuZCBjb250ZW50IGFyZSBlbXB0eSwgdGhlIHBvcG92ZXIgd29uJ3Qgb3Blbi5cbiAgICovXG4gIEBJbnB1dCgpIHBvcG92ZXJUaXRsZTogc3RyaW5nIHwgVGVtcGxhdGVSZWY8YW55PjtcbiAgLyoqXG4gICAqIFBsYWNlbWVudCBvZiBhIHBvcG92ZXIgYWNjZXB0czpcbiAgICogICAgXCJ0b3BcIiwgXCJ0b3AtbGVmdFwiLCBcInRvcC1yaWdodFwiLCBcImJvdHRvbVwiLCBcImJvdHRvbS1sZWZ0XCIsIFwiYm90dG9tLXJpZ2h0XCIsXG4gICAqICAgIFwibGVmdFwiLCBcImxlZnQtdG9wXCIsIFwibGVmdC1ib3R0b21cIiwgXCJyaWdodFwiLCBcInJpZ2h0LXRvcFwiLCBcInJpZ2h0LWJvdHRvbVwiXG4gICAqIGFuZCBhcnJheSBvZiBhYm92ZSB2YWx1ZXMuXG4gICAqL1xuICBASW5wdXQoKSBwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5O1xuICAvKipcbiAgICogU3BlY2lmaWVzIGV2ZW50cyB0aGF0IHNob3VsZCB0cmlnZ2VyLiBTdXBwb3J0cyBhIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGV2ZW50IG5hbWVzLlxuICAgKi9cbiAgQElucHV0KCkgdHJpZ2dlcnM6IHN0cmluZztcbiAgLyoqXG4gICAqIEEgc2VsZWN0b3Igc3BlY2lmeWluZyB0aGUgZWxlbWVudCB0aGUgcG9wb3ZlciBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAqIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIFwiYm9keVwiLlxuICAgKi9cbiAgQElucHV0KCkgY29udGFpbmVyOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBIGZsYWcgaW5kaWNhdGluZyBpZiBhIGdpdmVuIHBvcG92ZXIgaXMgZGlzYWJsZWQgYW5kIHNob3VsZCBub3QgYmUgZGlzcGxheWVkLlxuICAgKlxuICAgKiBAc2luY2UgMS4xLjBcbiAgICovXG4gIEBJbnB1dCgpIGRpc2FibGVQb3BvdmVyOiBib29sZWFuO1xuICAvKipcbiAgICogQW4gb3B0aW9uYWwgY2xhc3MgYXBwbGllZCB0byBuZ2ItcG9wb3Zlci13aW5kb3dcbiAgICpcbiAgICogQHNpbmNlIDIuMi4wXG4gICAqL1xuICBASW5wdXQoKSBwb3BvdmVyQ2xhc3M6IHN0cmluZztcbiAgLyoqXG4gICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gdGhlIHBvcG92ZXIgaXMgc2hvd25cbiAgICovXG4gIEBPdXRwdXQoKSBzaG93biA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgLyoqXG4gICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gdGhlIHBvcG92ZXIgaXMgaGlkZGVuXG4gICAqL1xuICBAT3V0cHV0KCkgaGlkZGVuID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgX25nYlBvcG92ZXJXaW5kb3dJZCA9IGBuZ2ItcG9wb3Zlci0ke25leHRJZCsrfWA7XG4gIHByaXZhdGUgX3BvcHVwU2VydmljZTogUG9wdXBTZXJ2aWNlPE5nYlBvcG92ZXJXaW5kb3c+O1xuICBwcml2YXRlIF93aW5kb3dSZWY6IENvbXBvbmVudFJlZjxOZ2JQb3BvdmVyV2luZG93PjtcbiAgcHJpdmF0ZSBfdW5yZWdpc3Rlckxpc3RlbmVyc0ZuO1xuICBwcml2YXRlIF96b25lU3Vic2NyaXB0aW9uOiBhbnk7XG4gIHByaXZhdGUgX2lzRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZVBvcG92ZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubmdiUG9wb3ZlciAmJiAhdGhpcy5wb3BvdmVyVGl0bGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZiwgY29uZmlnOiBOZ2JQb3BvdmVyQ29uZmlnLFxuICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnkpIHtcbiAgICB0aGlzLmF1dG9DbG9zZSA9IGNvbmZpZy5hdXRvQ2xvc2U7XG4gICAgdGhpcy5wbGFjZW1lbnQgPSBjb25maWcucGxhY2VtZW50O1xuICAgIHRoaXMudHJpZ2dlcnMgPSBjb25maWcudHJpZ2dlcnM7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb25maWcuY29udGFpbmVyO1xuICAgIHRoaXMuZGlzYWJsZVBvcG92ZXIgPSBjb25maWcuZGlzYWJsZVBvcG92ZXI7XG4gICAgdGhpcy5wb3BvdmVyQ2xhc3MgPSBjb25maWcucG9wb3ZlckNsYXNzO1xuICAgIHRoaXMuX3BvcHVwU2VydmljZSA9IG5ldyBQb3B1cFNlcnZpY2U8TmdiUG9wb3ZlcldpbmRvdz4oXG4gICAgICAgIE5nYlBvcG92ZXJXaW5kb3csIGluamVjdG9yLCB2aWV3Q29udGFpbmVyUmVmLCBfcmVuZGVyZXIsIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcik7XG5cbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uID0gX25nWm9uZS5vblN0YWJsZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX3dpbmRvd1JlZikge1xuICAgICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuYXBwbHlQbGFjZW1lbnQoXG4gICAgICAgICAgICBwb3NpdGlvbkVsZW1lbnRzKFxuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsIHRoaXMucGxhY2VtZW50LFxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID09PSAnYm9keScpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyBhbiBlbGVtZW50w6LCgMKZcyBwb3BvdmVyLiBUaGlzIGlzIGNvbnNpZGVyZWQgYSDDosKAwpxtYW51YWzDosKAwp0gdHJpZ2dlcmluZyBvZiB0aGUgcG9wb3Zlci5cbiAgICogVGhlIGNvbnRleHQgaXMgYW4gb3B0aW9uYWwgdmFsdWUgdG8gYmUgaW5qZWN0ZWQgaW50byB0aGUgcG9wb3ZlciB0ZW1wbGF0ZSB3aGVuIGl0IGlzIGNyZWF0ZWQuXG4gICAqL1xuICBvcGVuKGNvbnRleHQ/OiBhbnkpIHtcbiAgICBpZiAoIXRoaXMuX3dpbmRvd1JlZiAmJiAhdGhpcy5faXNEaXNhYmxlZCgpKSB7XG4gICAgICB0aGlzLl93aW5kb3dSZWYgPSB0aGlzLl9wb3B1cFNlcnZpY2Uub3Blbih0aGlzLm5nYlBvcG92ZXIsIGNvbnRleHQpO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLnRpdGxlID0gdGhpcy5wb3BvdmVyVGl0bGU7XG4gICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UucG9wb3ZlckNsYXNzID0gdGhpcy5wb3BvdmVyQ2xhc3M7XG4gICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuaWQgPSB0aGlzLl9uZ2JQb3BvdmVyV2luZG93SWQ7XG5cbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdhcmlhLWRlc2NyaWJlZGJ5JywgdGhpcy5fbmdiUG9wb3ZlcldpbmRvd0lkKTtcblxuICAgICAgaWYgKHRoaXMuY29udGFpbmVyID09PSAnYm9keScpIHtcbiAgICAgICAgdGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmNvbnRhaW5lcikuYXBwZW5kQ2hpbGQodGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBhcHBseSBzdHlsaW5nIHRvIHNldCBiYXNpYyBjc3MtY2xhc3NlcyBvbiB0YXJnZXQgZWxlbWVudCwgYmVmb3JlIGdvaW5nIGZvciBwb3NpdGlvbmluZ1xuICAgICAgdGhpcy5fd2luZG93UmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgLy8gcG9zaXRpb24gcG9wb3ZlciBhbG9uZyB0aGUgZWxlbWVudFxuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmFwcGx5UGxhY2VtZW50KFxuICAgICAgICAgIHBvc2l0aW9uRWxlbWVudHMoXG4gICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsIHRoaXMucGxhY2VtZW50LFxuICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKSk7XG5cbiAgICAgIGlmICh0aGlzLmF1dG9DbG9zZSkge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIC8vIHByZXZlbnRzIGF1dG9tYXRpYyBjbG9zaW5nIHJpZ2h0IGFmdGVyIGFuIG9wZW5pbmcgYnkgcHV0dGluZyBhIGd1YXJkIGZvciB0aGUgdGltZSBvZiBvbmUgZXZlbnQgaGFuZGxpbmdcbiAgICAgICAgICAvLyBwYXNzXG4gICAgICAgICAgLy8gdXNlIGNhc2U6IGNsaWNrIGV2ZW50IHdvdWxkIHJlYWNoIGFuIGVsZW1lbnQgb3BlbmluZyB0aGUgcG9wb3ZlciBmaXJzdCwgdGhlbiByZWFjaCB0aGUgYXV0b0Nsb3NlIGhhbmRsZXJcbiAgICAgICAgICAvLyB3aGljaCB3b3VsZCBjbG9zZSBpdFxuICAgICAgICAgIGxldCBqdXN0T3BlbmVkID0gdHJ1ZTtcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ganVzdE9wZW5lZCA9IGZhbHNlKTtcblxuICAgICAgICAgIGNvbnN0IGVzY2FwZXMkID0gZnJvbUV2ZW50PEtleWJvYXJkRXZlbnQ+KHRoaXMuX2RvY3VtZW50LCAna2V5dXAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWtlVW50aWwodGhpcy5oaWRkZW4pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGVwcmVjYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LndoaWNoID09PSBLZXkuRXNjYXBlKSk7XG5cbiAgICAgICAgICBjb25zdCBjbGlja3MkID0gZnJvbUV2ZW50PE1vdXNlRXZlbnQ+KHRoaXMuX2RvY3VtZW50LCAnY2xpY2snKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuaGlkZGVuKSwgZmlsdGVyKCgpID0+ICFqdXN0T3BlbmVkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gdGhpcy5fc2hvdWxkQ2xvc2VGcm9tQ2xpY2soZXZlbnQpKSk7XG5cbiAgICAgICAgICByYWNlPEV2ZW50PihbZXNjYXBlcyQsIGNsaWNrcyRdKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmNsb3NlKCkpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2hvd24uZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgYW4gZWxlbWVudMOiwoDCmXMgcG9wb3Zlci4gVGhpcyBpcyBjb25zaWRlcmVkIGEgw6LCgMKcbWFudWFsw6LCgMKdIHRyaWdnZXJpbmcgb2YgdGhlIHBvcG92ZXIuXG4gICAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fd2luZG93UmVmKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgdGhpcy5fcG9wdXBTZXJ2aWNlLmNsb3NlKCk7XG4gICAgICB0aGlzLl93aW5kb3dSZWYgPSBudWxsO1xuICAgICAgdGhpcy5oaWRkZW4uZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIGFuIGVsZW1lbnTDosKAwplzIHBvcG92ZXIuIFRoaXMgaXMgY29uc2lkZXJlZCBhIMOiwoDCnG1hbnVhbMOiwoDCnSB0cmlnZ2VyaW5nIG9mIHRoZSBwb3BvdmVyLlxuICAgKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl93aW5kb3dSZWYpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIHBvcG92ZXIgaXMgY3VycmVudGx5IGJlaW5nIHNob3duXG4gICAqL1xuICBpc09wZW4oKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl93aW5kb3dSZWYgIT0gbnVsbDsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbiA9IGxpc3RlblRvVHJpZ2dlcnMoXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMudHJpZ2dlcnMsIHRoaXMub3Blbi5iaW5kKHRoaXMpLCB0aGlzLmNsb3NlLmJpbmQodGhpcyksXG4gICAgICAgIHRoaXMudG9nZ2xlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIC8vIGNsb3NlIHBvcG92ZXIgaWYgdGl0bGUgYW5kIGNvbnRlbnQgYmVjb21lIGVtcHR5LCBvciBkaXNhYmxlUG9wb3ZlciBzZXQgdG8gdHJ1ZVxuICAgIGlmICgoY2hhbmdlc1snbmdiUG9wb3ZlciddIHx8IGNoYW5nZXNbJ3BvcG92ZXJUaXRsZSddIHx8IGNoYW5nZXNbJ2Rpc2FibGVQb3BvdmVyJ10pICYmIHRoaXMuX2lzRGlzYWJsZWQoKSkge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICAvLyBUaGlzIGNoZWNrIGlzIG5lZWRlZCBhcyBpdCBtaWdodCBoYXBwZW4gdGhhdCBuZ09uRGVzdHJveSBpcyBjYWxsZWQgYmVmb3JlIG5nT25Jbml0XG4gICAgLy8gdW5kZXIgY2VydGFpbiBjb25kaXRpb25zLCBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9uZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2lzc3Vlcy8yMTk5XG4gICAgaWYgKHRoaXMuX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbikge1xuICAgICAgdGhpcy5fdW5yZWdpc3Rlckxpc3RlbmVyc0ZuKCk7XG4gICAgfVxuICAgIHRoaXMuX3pvbmVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Nob3VsZENsb3NlRnJvbUNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMikge1xuICAgICAgaWYgKHRoaXMuYXV0b0Nsb3NlID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmF1dG9DbG9zZSA9PT0gJ2luc2lkZScgJiYgdGhpcy5faXNFdmVudEZyb21Qb3BvdmVyKGV2ZW50KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hdXRvQ2xvc2UgPT09ICdvdXRzaWRlJyAmJiAhdGhpcy5faXNFdmVudEZyb21Qb3BvdmVyKGV2ZW50KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfaXNFdmVudEZyb21Qb3BvdmVyKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgcG9wdXAgPSB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2U7XG4gICAgcmV0dXJuIHBvcHVwID8gcG9wdXAuaXNFdmVudEZyb20oZXZlbnQpIDogZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge05nYlBvcG92ZXIsIE5nYlBvcG92ZXJXaW5kb3d9IGZyb20gJy4vcG9wb3Zlcic7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuZXhwb3J0IHtOZ2JQb3BvdmVyfSBmcm9tICcuL3BvcG92ZXInO1xuZXhwb3J0IHtOZ2JQb3BvdmVyQ29uZmlnfSBmcm9tICcuL3BvcG92ZXItY29uZmlnJztcbmV4cG9ydCB7UGxhY2VtZW50fSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbTmdiUG9wb3ZlciwgTmdiUG9wb3ZlcldpbmRvd10sXG4gIGV4cG9ydHM6IFtOZ2JQb3BvdmVyXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGVudHJ5Q29tcG9uZW50czogW05nYlBvcG92ZXJXaW5kb3ddXG59KVxuZXhwb3J0IGNsYXNzIE5nYlBvcG92ZXJNb2R1bGUge1xuICAvKipcbiAgICogSW1wb3J0aW5nIHdpdGggJy5mb3JSb290KCknIGlzIG5vIGxvbmdlciBuZWNlc3NhcnksIHlvdSBjYW4gc2ltcGx5IGltcG9ydCB0aGUgbW9kdWxlLlxuICAgKiBXaWxsIGJlIHJlbW92ZWQgaW4gNC4wLjAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiUG9wb3Zlck1vZHVsZX07IH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBzZXJ2aWNlIGZvciB0aGUgTmdiUHJvZ3Jlc3NiYXIgY29tcG9uZW50LlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIHByb2dyZXNzIGJhcnMgdXNlZCBpbiB0aGUgYXBwbGljYXRpb24uXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYlByb2dyZXNzYmFyQ29uZmlnIHtcbiAgbWF4ID0gMTAwO1xuICBhbmltYXRlZCA9IGZhbHNlO1xuICBzdHJpcGVkID0gZmFsc2U7XG4gIHR5cGU6IHN0cmluZztcbiAgc2hvd1ZhbHVlID0gZmFsc2U7XG4gIGhlaWdodDogc3RyaW5nO1xufVxuIiwiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2dldFZhbHVlSW5SYW5nZX0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7TmdiUHJvZ3Jlc3NiYXJDb25maWd9IGZyb20gJy4vcHJvZ3Jlc3NiYXItY29uZmlnJztcblxuLyoqXG4gKiBEaXJlY3RpdmUgdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIGZlZWRiYWNrIG9uIHRoZSBwcm9ncmVzcyBvZiBhIHdvcmtmbG93IG9yIGFuIGFjdGlvbi5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLXByb2dyZXNzYmFyJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cInByb2dyZXNzXCIgW3N0eWxlLmhlaWdodF09XCJoZWlnaHRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJ7e3R5cGUgPyAnIGJnLScgKyB0eXBlIDogJyd9fXt7YW5pbWF0ZWQgPyAnIHByb2dyZXNzLWJhci1hbmltYXRlZCcgOiAnJ319e3tzdHJpcGVkID9cbiAgICAnIHByb2dyZXNzLWJhci1zdHJpcGVkJyA6ICcnfX1cIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBbc3R5bGUud2lkdGguJV09XCJnZXRQZXJjZW50VmFsdWUoKVwiXG4gICAgW2F0dHIuYXJpYS12YWx1ZW5vd109XCJnZXRWYWx1ZSgpXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBbYXR0ci5hcmlhLXZhbHVlbWF4XT1cIm1heFwiPlxuICAgICAgICA8c3BhbiAqbmdJZj1cInNob3dWYWx1ZVwiIGkxOG49XCJAQG5nYi5wcm9ncmVzc2Jhci52YWx1ZVwiPnt7Z2V0UGVyY2VudFZhbHVlKCl9fSU8L3NwYW4+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTmdiUHJvZ3Jlc3NiYXIge1xuICAvKipcbiAgICogTWF4aW1hbCB2YWx1ZSB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIHByb2dyZXNzYmFyLlxuICAgKi9cbiAgQElucHV0KCkgbWF4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEEgZmxhZyBpbmRpY2F0aW5nIGlmIHRoZSBzdHJpcGVzIG9mIHRoZSBwcm9ncmVzcyBiYXIgc2hvdWxkIGJlIGFuaW1hdGVkLiBUYWtlcyBlZmZlY3Qgb25seSBmb3IgYnJvd3NlcnNcbiAgICogc3VwcG9ydGluZyBDU1MzIGFuaW1hdGlvbnMsIGFuZCBpZiBzdHJpcGVkIGlzIHRydWUuXG4gICAqL1xuICBASW5wdXQoKSBhbmltYXRlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBmbGFnIGluZGljYXRpbmcgaWYgYSBwcm9ncmVzcyBiYXIgc2hvdWxkIGJlIGRpc3BsYXllZCBhcyBzdHJpcGVkLlxuICAgKi9cbiAgQElucHV0KCkgc3RyaXBlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBmbGFnIGluZGljYXRpbmcgaWYgdGhlIGN1cnJlbnQgcGVyY2VudGFnZSB2YWx1ZSBzaG91bGQgYmUgc2hvd24uXG4gICAqL1xuICBASW5wdXQoKSBzaG93VmFsdWU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgcHJvZ3Jlc3MgYmFyLCBjYW4gYmUgb25lIG9mIFwic3VjY2Vzc1wiLCBcImluZm9cIiwgXCJ3YXJuaW5nXCIgb3IgXCJkYW5nZXJcIi5cbiAgICovXG4gIEBJbnB1dCgpIHR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogQ3VycmVudCB2YWx1ZSB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIHByb2dyZXNzYmFyLiBTaG91bGQgYmUgc21hbGxlciBvciBlcXVhbCB0byBcIm1heFwiIHZhbHVlLlxuICAgKi9cbiAgQElucHV0KCkgdmFsdWUgPSAwO1xuXG4gIC8qKlxuICAgKiBIZWlnaHQgb2YgdGhlIHByb2dyZXNzIGJhci4gQWNjZXB0cyBhbnkgdmFsaWQgQ1NTIGhlaWdodCB2YWx1ZXMsIGV4LiAnMnJlbSdcbiAgICovXG4gIEBJbnB1dCgpIGhlaWdodDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTmdiUHJvZ3Jlc3NiYXJDb25maWcpIHtcbiAgICB0aGlzLm1heCA9IGNvbmZpZy5tYXg7XG4gICAgdGhpcy5hbmltYXRlZCA9IGNvbmZpZy5hbmltYXRlZDtcbiAgICB0aGlzLnN0cmlwZWQgPSBjb25maWcuc3RyaXBlZDtcbiAgICB0aGlzLnR5cGUgPSBjb25maWcudHlwZTtcbiAgICB0aGlzLnNob3dWYWx1ZSA9IGNvbmZpZy5zaG93VmFsdWU7XG4gICAgdGhpcy5oZWlnaHQgPSBjb25maWcuaGVpZ2h0O1xuICB9XG5cbiAgZ2V0VmFsdWUoKSB7IHJldHVybiBnZXRWYWx1ZUluUmFuZ2UodGhpcy52YWx1ZSwgdGhpcy5tYXgpOyB9XG5cbiAgZ2V0UGVyY2VudFZhbHVlKCkgeyByZXR1cm4gMTAwICogdGhpcy5nZXRWYWx1ZSgpIC8gdGhpcy5tYXg7IH1cbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7TmdiUHJvZ3Jlc3NiYXJ9IGZyb20gJy4vcHJvZ3Jlc3NiYXInO1xuXG5leHBvcnQge05nYlByb2dyZXNzYmFyfSBmcm9tICcuL3Byb2dyZXNzYmFyJztcbmV4cG9ydCB7TmdiUHJvZ3Jlc3NiYXJDb25maWd9IGZyb20gJy4vcHJvZ3Jlc3NiYXItY29uZmlnJztcblxuQE5nTW9kdWxlKHtkZWNsYXJhdGlvbnM6IFtOZ2JQcm9ncmVzc2Jhcl0sIGV4cG9ydHM6IFtOZ2JQcm9ncmVzc2Jhcl0sIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdfSlcbmV4cG9ydCBjbGFzcyBOZ2JQcm9ncmVzc2Jhck1vZHVsZSB7XG4gIC8qKlxuICAgKiBJbXBvcnRpbmcgd2l0aCAnLmZvclJvb3QoKScgaXMgbm8gbG9uZ2VyIG5lY2Vzc2FyeSwgeW91IGNhbiBzaW1wbHkgaW1wb3J0IHRoZSBtb2R1bGUuXG4gICAqIFdpbGwgYmUgcmVtb3ZlZCBpbiA0LjAuMC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgMy4wLjBcbiAgICovXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMgeyByZXR1cm4ge25nTW9kdWxlOiBOZ2JQcm9ncmVzc2Jhck1vZHVsZX07IH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBzZXJ2aWNlIGZvciB0aGUgTmdiUmF0aW5nIGNvbXBvbmVudC5cbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSByYXRpbmdzIHVzZWQgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JSYXRpbmdDb25maWcge1xuICBtYXggPSAxMDtcbiAgcmVhZG9ubHkgPSBmYWxzZTtcbiAgcmVzZXR0YWJsZSA9IGZhbHNlO1xufVxuIiwiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkluaXQsXG4gIFRlbXBsYXRlUmVmLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENvbnRlbnRDaGlsZCxcbiAgZm9yd2FyZFJlZixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nYlJhdGluZ0NvbmZpZ30gZnJvbSAnLi9yYXRpbmctY29uZmlnJztcbmltcG9ydCB7dG9TdHJpbmcsIGdldFZhbHVlSW5SYW5nZX0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7S2V5fSBmcm9tICcuLi91dGlsL2tleSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG4vKipcbiAqIENvbnRleHQgZm9yIHRoZSBjdXN0b20gc3RhciBkaXNwbGF5IHRlbXBsYXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RhclRlbXBsYXRlQ29udGV4dCB7XG4gIC8qKlxuICAgKiBTdGFyIGZpbGwgcGVyY2VudGFnZS4gQW4gaW50ZWdlciB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEwMFxuICAgKi9cbiAgZmlsbDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBJbmRleCBvZiB0aGUgc3Rhci5cbiAgICovXG4gIGluZGV4OiBudW1iZXI7XG59XG5cbmNvbnN0IE5HQl9SQVRJTkdfVkFMVUVfQUNDRVNTT1IgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ2JSYXRpbmcpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBSYXRpbmcgZGlyZWN0aXZlIHRoYXQgd2lsbCB0YWtlIGNhcmUgb2YgdmlzdWFsaXNpbmcgYSBzdGFyIHJhdGluZyBiYXIuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1yYXRpbmcnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdkLWlubGluZS1mbGV4JyxcbiAgICAndGFiaW5kZXgnOiAnMCcsXG4gICAgJ3JvbGUnOiAnc2xpZGVyJyxcbiAgICAnYXJpYS12YWx1ZW1pbic6ICcwJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW1heF0nOiAnbWF4JyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW5vd10nOiAnbmV4dFJhdGUnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVldGV4dF0nOiAnYXJpYVZhbHVlVGV4dCgpJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAncmVhZG9ubHkgPyB0cnVlIDogbnVsbCcsXG4gICAgJyhibHVyKSc6ICdoYW5kbGVCbHVyKCknLFxuICAgICcoa2V5ZG93biknOiAnaGFuZGxlS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKG1vdXNlbGVhdmUpJzogJ3Jlc2V0KCknXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlICN0IGxldC1maWxsPVwiZmlsbFwiPnt7IGZpbGwgPT09IDEwMCA/ICcmIzk3MzM7JyA6ICcmIzk3MzQ7JyB9fTwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlIG5nRm9yIFtuZ0Zvck9mXT1cImNvbnRleHRzXCIgbGV0LWluZGV4PVwiaW5kZXhcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPih7eyBpbmRleCA8IG5leHRSYXRlID8gJyonIDogJyAnIH19KTwvc3Bhbj5cbiAgICAgIDxzcGFuIChtb3VzZWVudGVyKT1cImVudGVyKGluZGV4ICsgMSlcIiAoY2xpY2spPVwiaGFuZGxlQ2xpY2soaW5kZXggKyAxKVwiIFtzdHlsZS5jdXJzb3JdPVwicmVhZG9ubHkgfHwgZGlzYWJsZWQgPyAnZGVmYXVsdCcgOiAncG9pbnRlcidcIj5cbiAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInN0YXJUZW1wbGF0ZSB8fCB0XCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImNvbnRleHRzW2luZGV4XVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICA8L3NwYW4+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbTkdCX1JBVElOR19WQUxVRV9BQ0NFU1NPUl1cbn0pXG5leHBvcnQgY2xhc3MgTmdiUmF0aW5nIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgT25Jbml0LCBPbkNoYW5nZXMge1xuICBjb250ZXh0czogU3RhclRlbXBsYXRlQ29udGV4dFtdID0gW107XG4gIGRpc2FibGVkID0gZmFsc2U7XG4gIG5leHRSYXRlOiBudW1iZXI7XG5cblxuICAvKipcbiAgICogTWF4aW1hbCByYXRpbmcgdGhhdCBjYW4gYmUgZ2l2ZW4gdXNpbmcgdGhpcyB3aWRnZXQuXG4gICAqL1xuICBASW5wdXQoKSBtYXg6IG51bWJlcjtcblxuICAvKipcbiAgICogQ3VycmVudCByYXRpbmcuIENhbiBiZSBhIGRlY2ltYWwgdmFsdWUgbGlrZSAzLjc1XG4gICAqL1xuICBASW5wdXQoKSByYXRlOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEEgZmxhZyBpbmRpY2F0aW5nIGlmIHJhdGluZyBjYW4gYmUgdXBkYXRlZC5cbiAgICovXG4gIEBJbnB1dCgpIHJlYWRvbmx5OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgaW5kaWNhdGluZyBpZiByYXRpbmcgY2FuIGJlIHJlc2V0IHRvIDAgb24gbW91c2UgY2xpY2tcbiAgICovXG4gIEBJbnB1dCgpIHJlc2V0dGFibGU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgdGVtcGxhdGUgdG8gb3ZlcnJpZGUgc3RhciBkaXNwbGF5LlxuICAgKiBBbHRlcm5hdGl2ZWx5IHB1dCBhIDxuZy10ZW1wbGF0ZT4gYXMgdGhlIG9ubHkgY2hpbGQgb2YgPG5nYi1yYXRpbmc+IGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgpIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpIHN0YXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8U3RhclRlbXBsYXRlQ29udGV4dD47XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGZpcmVkIHdoZW4gYSB1c2VyIGlzIGhvdmVyaW5nIG92ZXIgYSBnaXZlbiByYXRpbmcuXG4gICAqIEV2ZW50J3MgcGF5bG9hZCBlcXVhbHMgdG8gdGhlIHJhdGluZyBiZWluZyBob3ZlcmVkIG92ZXIuXG4gICAqL1xuICBAT3V0cHV0KCkgaG92ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKipcbiAgICogQW4gZXZlbnQgZmlyZWQgd2hlbiBhIHVzZXIgc3RvcHMgaG92ZXJpbmcgb3ZlciBhIGdpdmVuIHJhdGluZy5cbiAgICogRXZlbnQncyBwYXlsb2FkIGVxdWFscyB0byB0aGUgcmF0aW5nIG9mIHRoZSBsYXN0IGl0ZW0gYmVpbmcgaG92ZXJlZCBvdmVyLlxuICAgKi9cbiAgQE91dHB1dCgpIGxlYXZlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGZpcmVkIHdoZW4gYSB1c2VyIHNlbGVjdHMgYSBuZXcgcmF0aW5nLlxuICAgKiBFdmVudCdzIHBheWxvYWQgZXF1YWxzIHRvIHRoZSBuZXdseSBzZWxlY3RlZCByYXRpbmcuXG4gICAqL1xuICBAT3V0cHV0KCkgcmF0ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPih0cnVlKTtcblxuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE5nYlJhdGluZ0NvbmZpZywgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgdGhpcy5tYXggPSBjb25maWcubWF4O1xuICAgIHRoaXMucmVhZG9ubHkgPSBjb25maWcucmVhZG9ubHk7XG4gIH1cblxuICBhcmlhVmFsdWVUZXh0KCkgeyByZXR1cm4gYCR7dGhpcy5uZXh0UmF0ZX0gb3V0IG9mICR7dGhpcy5tYXh9YDsgfVxuXG4gIGVudGVyKHZhbHVlOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMucmVhZG9ubHkgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKHZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy5ob3Zlci5lbWl0KHZhbHVlKTtcbiAgfVxuXG4gIGhhbmRsZUJsdXIoKSB7IHRoaXMub25Ub3VjaGVkKCk7IH1cblxuICBoYW5kbGVDbGljayh2YWx1ZTogbnVtYmVyKSB7IHRoaXMudXBkYXRlKHRoaXMucmVzZXR0YWJsZSAmJiB0aGlzLnJhdGUgPT09IHZhbHVlID8gMCA6IHZhbHVlKTsgfVxuXG4gIGhhbmRsZUtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGVwcmVjYXRpb25cbiAgICBjb25zdCB7d2hpY2h9ID0gZXZlbnQ7XG4gICAgaWYgKEtleVt0b1N0cmluZyh3aGljaCldKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBzd2l0Y2ggKHdoaWNoKSB7XG4gICAgICAgIGNhc2UgS2V5LkFycm93RG93bjpcbiAgICAgICAgY2FzZSBLZXkuQXJyb3dMZWZ0OlxuICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMucmF0ZSAtIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5BcnJvd1VwOlxuICAgICAgICBjYXNlIEtleS5BcnJvd1JpZ2h0OlxuICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMucmF0ZSArIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5Ib21lOlxuICAgICAgICAgIHRoaXMudXBkYXRlKDApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5FbmQ6XG4gICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5tYXgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1sncmF0ZSddKSB7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLnJhdGUpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGV4dHMgPSBBcnJheS5mcm9tKHtsZW5ndGg6IHRoaXMubWF4fSwgKHYsIGspID0+ICh7ZmlsbDogMCwgaW5kZXg6IGt9KSk7XG4gICAgdGhpcy5fdXBkYXRlU3RhdGUodGhpcy5yYXRlKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5vbkNoYW5nZSA9IGZuOyB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5sZWF2ZS5lbWl0KHRoaXMubmV4dFJhdGUpO1xuICAgIHRoaXMuX3VwZGF0ZVN0YXRlKHRoaXMucmF0ZSk7XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHsgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7IH1cblxuICB1cGRhdGUodmFsdWU6IG51bWJlciwgaW50ZXJuYWxDaGFuZ2UgPSB0cnVlKTogdm9pZCB7XG4gICAgY29uc3QgbmV3UmF0ZSA9IGdldFZhbHVlSW5SYW5nZSh2YWx1ZSwgdGhpcy5tYXgsIDApO1xuICAgIGlmICghdGhpcy5yZWFkb25seSAmJiAhdGhpcy5kaXNhYmxlZCAmJiB0aGlzLnJhdGUgIT09IG5ld1JhdGUpIHtcbiAgICAgIHRoaXMucmF0ZSA9IG5ld1JhdGU7XG4gICAgICB0aGlzLnJhdGVDaGFuZ2UuZW1pdCh0aGlzLnJhdGUpO1xuICAgIH1cbiAgICBpZiAoaW50ZXJuYWxDaGFuZ2UpIHtcbiAgICAgIHRoaXMub25DaGFuZ2UodGhpcy5yYXRlKTtcbiAgICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gICAgfVxuICAgIHRoaXMuX3VwZGF0ZVN0YXRlKHRoaXMucmF0ZSk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy51cGRhdGUodmFsdWUsIGZhbHNlKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEZpbGxWYWx1ZShpbmRleDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBkaWZmID0gdGhpcy5uZXh0UmF0ZSAtIGluZGV4O1xuXG4gICAgaWYgKGRpZmYgPj0gMSkge1xuICAgICAgcmV0dXJuIDEwMDtcbiAgICB9XG4gICAgaWYgKGRpZmYgPCAxICYmIGRpZmYgPiAwKSB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQoKGRpZmYgKiAxMDApLnRvRml4ZWQoMiksIDEwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVN0YXRlKG5leHRWYWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5uZXh0UmF0ZSA9IG5leHRWYWx1ZTtcbiAgICB0aGlzLmNvbnRleHRzLmZvckVhY2goKGNvbnRleHQsIGluZGV4KSA9PiBjb250ZXh0LmZpbGwgPSB0aGlzLl9nZXRGaWxsVmFsdWUoaW5kZXgpKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHtOZ2JSYXRpbmd9IGZyb20gJy4vcmF0aW5nJztcblxuZXhwb3J0IHtOZ2JSYXRpbmd9IGZyb20gJy4vcmF0aW5nJztcbmV4cG9ydCB7TmdiUmF0aW5nQ29uZmlnfSBmcm9tICcuL3JhdGluZy1jb25maWcnO1xuXG5ATmdNb2R1bGUoe2RlY2xhcmF0aW9uczogW05nYlJhdGluZ10sIGV4cG9ydHM6IFtOZ2JSYXRpbmddLCBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXX0pXG5leHBvcnQgY2xhc3MgTmdiUmF0aW5nTW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYlJhdGluZ01vZHVsZX07IH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBzZXJ2aWNlIGZvciB0aGUgTmdiVGFic2V0IGNvbXBvbmVudC5cbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSB0YWJzZXRzIHVzZWQgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JUYWJzZXRDb25maWcge1xuICBqdXN0aWZ5OiAnc3RhcnQnIHwgJ2NlbnRlcicgfCAnZW5kJyB8ICdmaWxsJyB8ICdqdXN0aWZpZWQnID0gJ3N0YXJ0JztcbiAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcgPSAnaG9yaXpvbnRhbCc7XG4gIHR5cGU6ICd0YWJzJyB8ICdwaWxscycgPSAndGFicyc7XG59XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIFF1ZXJ5TGlzdCxcbiAgRGlyZWN0aXZlLFxuICBUZW1wbGF0ZVJlZixcbiAgQ29udGVudENoaWxkLFxuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiVGFic2V0Q29uZmlnfSBmcm9tICcuL3RhYnNldC1jb25maWcnO1xuXG5sZXQgbmV4dElkID0gMDtcblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBzaG91bGQgYmUgdXNlZCB0byB3cmFwIHRhYiB0aXRsZXMgdGhhdCBuZWVkIHRvIGNvbnRhaW4gSFRNTCBtYXJrdXAgb3Igb3RoZXIgZGlyZWN0aXZlcy5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JUYWJUaXRsZV0nfSlcbmV4cG9ydCBjbGFzcyBOZ2JUYWJUaXRsZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55Pikge31cbn1cblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBtdXN0IGJlIHVzZWQgdG8gd3JhcCBjb250ZW50IHRvIGJlIGRpc3BsYXllZCBpbiBhIHRhYi5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JUYWJDb250ZW50XSd9KVxuZXhwb3J0IGNsYXNzIE5nYlRhYkNvbnRlbnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4pIHt9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgcmVwcmVzZW50aW5nIGFuIGluZGl2aWR1YWwgdGFiLlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nYi10YWInfSlcbmV4cG9ydCBjbGFzcyBOZ2JUYWIge1xuICAvKipcbiAgICogVW5pcXVlIHRhYiBpZGVudGlmaWVyLiBNdXN0IGJlIHVuaXF1ZSBmb3IgdGhlIGVudGlyZSBkb2N1bWVudCBmb3IgcHJvcGVyIGFjY2Vzc2liaWxpdHkgc3VwcG9ydC5cbiAgICovXG4gIEBJbnB1dCgpIGlkID0gYG5nYi10YWItJHtuZXh0SWQrK31gO1xuICAvKipcbiAgICogU2ltcGxlIChzdHJpbmcgb25seSkgdGl0bGUuIFVzZSB0aGUgXCJOZ2JUYWJUaXRsZVwiIGRpcmVjdGl2ZSBmb3IgbW9yZSBjb21wbGV4IHVzZS1jYXNlcy5cbiAgICovXG4gIEBJbnB1dCgpIHRpdGxlOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBbGxvd3MgdG9nZ2xpbmcgZGlzYWJsZWQgc3RhdGUgb2YgYSBnaXZlbiBzdGF0ZS4gRGlzYWJsZWQgdGFicyBjYW4ndCBiZSBzZWxlY3RlZC5cbiAgICovXG4gIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgdGl0bGVUcGw6IE5nYlRhYlRpdGxlIHwgbnVsbDtcbiAgY29udGVudFRwbDogTmdiVGFiQ29udGVudCB8IG51bGw7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihOZ2JUYWJUaXRsZSwge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIHRpdGxlVHBsczogUXVlcnlMaXN0PE5nYlRhYlRpdGxlPjtcbiAgQENvbnRlbnRDaGlsZHJlbihOZ2JUYWJDb250ZW50LCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgY29udGVudFRwbHM6IFF1ZXJ5TGlzdDxOZ2JUYWJDb250ZW50PjtcblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgLy8gV2UgYXJlIHVzaW5nIEBDb250ZW50Q2hpbGRyZW4gaW5zdGVhZCBvZiBAQ29udGVudENoaWxkIGFzIGluIHRoZSBBbmd1bGFyIHZlcnNpb24gYmVpbmcgdXNlZFxuICAgIC8vIG9ubHkgQENvbnRlbnRDaGlsZHJlbiBhbGxvd3MgdXMgdG8gc3BlY2lmeSB0aGUge2Rlc2NlbmRhbnRzOiBmYWxzZX0gb3B0aW9uLlxuICAgIC8vIFdpdGhvdXQge2Rlc2NlbmRhbnRzOiBmYWxzZX0gd2UgYXJlIGhpdHRpbmcgYnVncyBkZXNjcmliZWQgaW46XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL25nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvaXNzdWVzLzIyNDBcbiAgICB0aGlzLnRpdGxlVHBsID0gdGhpcy50aXRsZVRwbHMuZmlyc3Q7XG4gICAgdGhpcy5jb250ZW50VHBsID0gdGhpcy5jb250ZW50VHBscy5maXJzdDtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBwYXlsb2FkIG9mIHRoZSBjaGFuZ2UgZXZlbnQgZmlyZWQgcmlnaHQgYmVmb3JlIHRoZSB0YWIgY2hhbmdlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiVGFiQ2hhbmdlRXZlbnQge1xuICAvKipcbiAgICogSWQgb2YgdGhlIGN1cnJlbnRseSBhY3RpdmUgdGFiXG4gICAqL1xuICBhY3RpdmVJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZCBvZiB0aGUgbmV3bHkgc2VsZWN0ZWQgdGFiXG4gICAqL1xuICBuZXh0SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCB3aWxsIHByZXZlbnQgdGFiIHN3aXRjaCBpZiBjYWxsZWRcbiAgICovXG4gIHByZXZlbnREZWZhdWx0OiAoKSA9PiB2b2lkO1xufVxuXG4vKipcbiAqIEEgY29tcG9uZW50IHRoYXQgbWFrZXMgaXQgZWFzeSB0byBjcmVhdGUgdGFiYmVkIGludGVyZmFjZS5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLXRhYnNldCcsXG4gIGV4cG9ydEFzOiAnbmdiVGFic2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dWwgW2NsYXNzXT1cIiduYXYgbmF2LScgKyB0eXBlICsgKG9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJz8gICcgJyArIGp1c3RpZnlDbGFzcyA6ICcgZmxleC1jb2x1bW4nKVwiIHJvbGU9XCJ0YWJsaXN0XCI+XG4gICAgICA8bGkgY2xhc3M9XCJuYXYtaXRlbVwiICpuZ0Zvcj1cImxldCB0YWIgb2YgdGFic1wiPlxuICAgICAgICA8YSBbaWRdPVwidGFiLmlkXCIgY2xhc3M9XCJuYXYtbGlua1wiIFtjbGFzcy5hY3RpdmVdPVwidGFiLmlkID09PSBhY3RpdmVJZFwiIFtjbGFzcy5kaXNhYmxlZF09XCJ0YWIuZGlzYWJsZWRcIlxuICAgICAgICAgIGhyZWYgKGNsaWNrKT1cInNlbGVjdCh0YWIuaWQpOyAkZXZlbnQucHJldmVudERlZmF1bHQoKVwiIHJvbGU9XCJ0YWJcIiBbYXR0ci50YWJpbmRleF09XCIodGFiLmRpc2FibGVkID8gJy0xJzogdW5kZWZpbmVkKVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1jb250cm9sc109XCIoIWRlc3Ryb3lPbkhpZGUgfHwgdGFiLmlkID09PSBhY3RpdmVJZCA/IHRhYi5pZCArICctcGFuZWwnIDogbnVsbClcIlxuICAgICAgICAgIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwidGFiLmlkID09PSBhY3RpdmVJZFwiIFthdHRyLmFyaWEtZGlzYWJsZWRdPVwidGFiLmRpc2FibGVkXCI+XG4gICAgICAgICAge3t0YWIudGl0bGV9fTxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJ0YWIudGl0bGVUcGw/LnRlbXBsYXRlUmVmXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICAgIDxkaXYgY2xhc3M9XCJ0YWItY29udGVudFwiPlxuICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC10YWIgW25nRm9yT2ZdPVwidGFic1wiPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3M9XCJ0YWItcGFuZSB7e3RhYi5pZCA9PT0gYWN0aXZlSWQgPyAnYWN0aXZlJyA6IG51bGx9fVwiXG4gICAgICAgICAgKm5nSWY9XCIhZGVzdHJveU9uSGlkZSB8fCB0YWIuaWQgPT09IGFjdGl2ZUlkXCJcbiAgICAgICAgICByb2xlPVwidGFicGFuZWxcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJ0YWIuaWRcIiBpZD1cInt7dGFiLmlkfX0tcGFuZWxcIlxuICAgICAgICAgIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwidGFiLmlkID09PSBhY3RpdmVJZFwiPlxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJ0YWIuY29udGVudFRwbD8udGVtcGxhdGVSZWZcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTmdiVGFic2V0IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCB7XG4gIGp1c3RpZnlDbGFzczogc3RyaW5nO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTmdiVGFiKSB0YWJzOiBRdWVyeUxpc3Q8TmdiVGFiPjtcblxuICAvKipcbiAgICogQW4gaWRlbnRpZmllciBvZiBhbiBpbml0aWFsbHkgc2VsZWN0ZWQgKGFjdGl2ZSkgdGFiLiBVc2UgdGhlIFwic2VsZWN0XCIgbWV0aG9kIHRvIHN3aXRjaCBhIHRhYiBwcm9ncmFtbWF0aWNhbGx5LlxuICAgKi9cbiAgQElucHV0KCkgYWN0aXZlSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2xvc2VkIHRhYnMgc2hvdWxkIGJlIGhpZGRlbiB3aXRob3V0IGRlc3Ryb3lpbmcgdGhlbVxuICAgKi9cbiAgQElucHV0KCkgZGVzdHJveU9uSGlkZSA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFRoZSBob3Jpem9udGFsIGFsaWdubWVudCBvZiB0aGUgbmF2IHdpdGggZmxleGJveCB1dGlsaXRpZXMuIENhbiBiZSBvbmUgb2YgJ3N0YXJ0JywgJ2NlbnRlcicsICdlbmQnLCAnZmlsbCcgb3JcbiAgICogJ2p1c3RpZmllZCdcbiAgICogVGhlIGRlZmF1bHQgdmFsdWUgaXMgJ3N0YXJ0Jy5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBqdXN0aWZ5KGNsYXNzTmFtZTogJ3N0YXJ0JyB8ICdjZW50ZXInIHwgJ2VuZCcgfCAnZmlsbCcgfCAnanVzdGlmaWVkJykge1xuICAgIGlmIChjbGFzc05hbWUgPT09ICdmaWxsJyB8fCBjbGFzc05hbWUgPT09ICdqdXN0aWZpZWQnKSB7XG4gICAgICB0aGlzLmp1c3RpZnlDbGFzcyA9IGBuYXYtJHtjbGFzc05hbWV9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5qdXN0aWZ5Q2xhc3MgPSBganVzdGlmeS1jb250ZW50LSR7Y2xhc3NOYW1lfWA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmF2IChob3Jpem9udGFsIG9yIHZlcnRpY2FsKS5cbiAgICogVGhlIGRlZmF1bHQgdmFsdWUgaXMgJ2hvcml6b250YWwnLlxuICAgKi9cbiAgQElucHV0KCkgb3JpZW50YXRpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCc7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgbmF2aWdhdGlvbiB0byBiZSB1c2VkIGZvciB0YWJzLiBDYW4gYmUgb25lIG9mIEJvb3RzdHJhcCBkZWZpbmVkIHR5cGVzICgndGFicycgb3IgJ3BpbGxzJykuXG4gICAqIFNpbmNlIDMuMC4wIGNhbiBhbHNvIGJlIGFuIGFyYml0cmFyeSBzdHJpbmcgKGZvciBjdXN0b20gdGhlbWVzKS5cbiAgICovXG4gIEBJbnB1dCgpIHR5cGU6ICd0YWJzJyB8ICdwaWxscycgfCBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgdGFiIGNoYW5nZSBldmVudCBmaXJlZCByaWdodCBiZWZvcmUgdGhlIHRhYiBzZWxlY3Rpb24gaGFwcGVucy4gU2VlIE5nYlRhYkNoYW5nZUV2ZW50IGZvciBwYXlsb2FkIGRldGFpbHNcbiAgICovXG4gIEBPdXRwdXQoKSB0YWJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYlRhYkNoYW5nZUV2ZW50PigpO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTmdiVGFic2V0Q29uZmlnKSB7XG4gICAgdGhpcy50eXBlID0gY29uZmlnLnR5cGU7XG4gICAgdGhpcy5qdXN0aWZ5ID0gY29uZmlnLmp1c3RpZnk7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IGNvbmZpZy5vcmllbnRhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIHRoZSB0YWIgd2l0aCB0aGUgZ2l2ZW4gaWQgYW5kIHNob3dzIGl0cyBhc3NvY2lhdGVkIHBhbmUuXG4gICAqIEFueSBvdGhlciB0YWIgdGhhdCB3YXMgcHJldmlvdXNseSBzZWxlY3RlZCBiZWNvbWVzIHVuc2VsZWN0ZWQgYW5kIGl0cyBhc3NvY2lhdGVkIHBhbmUgaXMgaGlkZGVuLlxuICAgKi9cbiAgc2VsZWN0KHRhYklkOiBzdHJpbmcpIHtcbiAgICBsZXQgc2VsZWN0ZWRUYWIgPSB0aGlzLl9nZXRUYWJCeUlkKHRhYklkKTtcbiAgICBpZiAoc2VsZWN0ZWRUYWIgJiYgIXNlbGVjdGVkVGFiLmRpc2FibGVkICYmIHRoaXMuYWN0aXZlSWQgIT09IHNlbGVjdGVkVGFiLmlkKSB7XG4gICAgICBsZXQgZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xuXG4gICAgICB0aGlzLnRhYkNoYW5nZS5lbWl0KFxuICAgICAgICAgIHthY3RpdmVJZDogdGhpcy5hY3RpdmVJZCwgbmV4dElkOiBzZWxlY3RlZFRhYi5pZCwgcHJldmVudERlZmF1bHQ6ICgpID0+IHsgZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7IH19KTtcblxuICAgICAgaWYgKCFkZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlSWQgPSBzZWxlY3RlZFRhYi5pZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgLy8gYXV0by1jb3JyZWN0IGFjdGl2ZUlkIHRoYXQgbWlnaHQgaGF2ZSBiZWVuIHNldCBpbmNvcnJlY3RseSBhcyBpbnB1dFxuICAgIGxldCBhY3RpdmVUYWIgPSB0aGlzLl9nZXRUYWJCeUlkKHRoaXMuYWN0aXZlSWQpO1xuICAgIHRoaXMuYWN0aXZlSWQgPSBhY3RpdmVUYWIgPyBhY3RpdmVUYWIuaWQgOiAodGhpcy50YWJzLmxlbmd0aCA/IHRoaXMudGFicy5maXJzdC5pZCA6IG51bGwpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0VGFiQnlJZChpZDogc3RyaW5nKTogTmdiVGFiIHtcbiAgICBsZXQgdGFic1dpdGhJZDogTmdiVGFiW10gPSB0aGlzLnRhYnMuZmlsdGVyKHRhYiA9PiB0YWIuaWQgPT09IGlkKTtcbiAgICByZXR1cm4gdGFic1dpdGhJZC5sZW5ndGggPyB0YWJzV2l0aElkWzBdIDogbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IHtOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHtOZ2JUYWJzZXQsIE5nYlRhYiwgTmdiVGFiQ29udGVudCwgTmdiVGFiVGl0bGV9IGZyb20gJy4vdGFic2V0JztcblxuZXhwb3J0IHtOZ2JUYWJzZXQsIE5nYlRhYiwgTmdiVGFiQ29udGVudCwgTmdiVGFiVGl0bGUsIE5nYlRhYkNoYW5nZUV2ZW50fSBmcm9tICcuL3RhYnNldCc7XG5leHBvcnQge05nYlRhYnNldENvbmZpZ30gZnJvbSAnLi90YWJzZXQtY29uZmlnJztcblxuY29uc3QgTkdCX1RBQlNFVF9ESVJFQ1RJVkVTID0gW05nYlRhYnNldCwgTmdiVGFiLCBOZ2JUYWJDb250ZW50LCBOZ2JUYWJUaXRsZV07XG5cbkBOZ01vZHVsZSh7ZGVjbGFyYXRpb25zOiBOR0JfVEFCU0VUX0RJUkVDVElWRVMsIGV4cG9ydHM6IE5HQl9UQUJTRVRfRElSRUNUSVZFUywgaW1wb3J0czogW0NvbW1vbk1vZHVsZV19KVxuZXhwb3J0IGNsYXNzIE5nYlRhYnNldE1vZHVsZSB7XG4gIC8qKlxuICAgKiBJbXBvcnRpbmcgd2l0aCAnLmZvclJvb3QoKScgaXMgbm8gbG9uZ2VyIG5lY2Vzc2FyeSwgeW91IGNhbiBzaW1wbHkgaW1wb3J0IHRoZSBtb2R1bGUuXG4gICAqIFdpbGwgYmUgcmVtb3ZlZCBpbiA0LjAuMC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgMy4wLjBcbiAgICovXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMgeyByZXR1cm4ge25nTW9kdWxlOiBOZ2JUYWJzZXRNb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge2lzTnVtYmVyLCB0b0ludGVnZXJ9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBOZ2JUaW1lIHtcbiAgaG91cjogbnVtYmVyO1xuICBtaW51dGU6IG51bWJlcjtcbiAgc2Vjb25kOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoaG91cj86IG51bWJlciwgbWludXRlPzogbnVtYmVyLCBzZWNvbmQ/OiBudW1iZXIpIHtcbiAgICB0aGlzLmhvdXIgPSB0b0ludGVnZXIoaG91cik7XG4gICAgdGhpcy5taW51dGUgPSB0b0ludGVnZXIobWludXRlKTtcbiAgICB0aGlzLnNlY29uZCA9IHRvSW50ZWdlcihzZWNvbmQpO1xuICB9XG5cbiAgY2hhbmdlSG91cihzdGVwID0gMSkgeyB0aGlzLnVwZGF0ZUhvdXIoKGlzTmFOKHRoaXMuaG91cikgPyAwIDogdGhpcy5ob3VyKSArIHN0ZXApOyB9XG5cbiAgdXBkYXRlSG91cihob3VyOiBudW1iZXIpIHtcbiAgICBpZiAoaXNOdW1iZXIoaG91cikpIHtcbiAgICAgIHRoaXMuaG91ciA9IChob3VyIDwgMCA/IDI0ICsgaG91ciA6IGhvdXIpICUgMjQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaG91ciA9IE5hTjtcbiAgICB9XG4gIH1cblxuICBjaGFuZ2VNaW51dGUoc3RlcCA9IDEpIHsgdGhpcy51cGRhdGVNaW51dGUoKGlzTmFOKHRoaXMubWludXRlKSA/IDAgOiB0aGlzLm1pbnV0ZSkgKyBzdGVwKTsgfVxuXG4gIHVwZGF0ZU1pbnV0ZShtaW51dGU6IG51bWJlcikge1xuICAgIGlmIChpc051bWJlcihtaW51dGUpKSB7XG4gICAgICB0aGlzLm1pbnV0ZSA9IG1pbnV0ZSAlIDYwIDwgMCA/IDYwICsgbWludXRlICUgNjAgOiBtaW51dGUgJSA2MDtcbiAgICAgIHRoaXMuY2hhbmdlSG91cihNYXRoLmZsb29yKG1pbnV0ZSAvIDYwKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWludXRlID0gTmFOO1xuICAgIH1cbiAgfVxuXG4gIGNoYW5nZVNlY29uZChzdGVwID0gMSkgeyB0aGlzLnVwZGF0ZVNlY29uZCgoaXNOYU4odGhpcy5zZWNvbmQpID8gMCA6IHRoaXMuc2Vjb25kKSArIHN0ZXApOyB9XG5cbiAgdXBkYXRlU2Vjb25kKHNlY29uZDogbnVtYmVyKSB7XG4gICAgaWYgKGlzTnVtYmVyKHNlY29uZCkpIHtcbiAgICAgIHRoaXMuc2Vjb25kID0gc2Vjb25kIDwgMCA/IDYwICsgc2Vjb25kICUgNjAgOiBzZWNvbmQgJSA2MDtcbiAgICAgIHRoaXMuY2hhbmdlTWludXRlKE1hdGguZmxvb3Ioc2Vjb25kIC8gNjApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWNvbmQgPSBOYU47XG4gICAgfVxuICB9XG5cbiAgaXNWYWxpZChjaGVja1NlY3MgPSB0cnVlKSB7XG4gICAgcmV0dXJuIGlzTnVtYmVyKHRoaXMuaG91cikgJiYgaXNOdW1iZXIodGhpcy5taW51dGUpICYmIChjaGVja1NlY3MgPyBpc051bWJlcih0aGlzLnNlY29uZCkgOiB0cnVlKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gYCR7dGhpcy5ob3VyIHx8IDB9OiR7dGhpcy5taW51dGUgfHwgMH06JHt0aGlzLnNlY29uZCB8fCAwfWA7IH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBzZXJ2aWNlIGZvciB0aGUgTmdiVGltZXBpY2tlciBjb21wb25lbnQuXG4gKiBZb3UgY2FuIGluamVjdCB0aGlzIHNlcnZpY2UsIHR5cGljYWxseSBpbiB5b3VyIHJvb3QgY29tcG9uZW50LCBhbmQgY3VzdG9taXplIHRoZSB2YWx1ZXMgb2YgaXRzIHByb3BlcnRpZXMgaW5cbiAqIG9yZGVyIHRvIHByb3ZpZGUgZGVmYXVsdCB2YWx1ZXMgZm9yIGFsbCB0aGUgdGltZXBpY2tlcnMgdXNlZCBpbiB0aGUgYXBwbGljYXRpb24uXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYlRpbWVwaWNrZXJDb25maWcge1xuICBtZXJpZGlhbiA9IGZhbHNlO1xuICBzcGlubmVycyA9IHRydWU7XG4gIHNlY29uZHMgPSBmYWxzZTtcbiAgaG91clN0ZXAgPSAxO1xuICBtaW51dGVTdGVwID0gMTtcbiAgc2Vjb25kU3RlcCA9IDE7XG4gIGRpc2FibGVkID0gZmFsc2U7XG4gIHJlYWRvbmx5SW5wdXRzID0gZmFsc2U7XG4gIHNpemU6ICdzbWFsbCcgfCAnbWVkaXVtJyB8ICdsYXJnZScgPSAnbWVkaXVtJztcbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nYlRpbWVTdHJ1Y3R9IGZyb20gJy4vbmdiLXRpbWUtc3RydWN0JztcbmltcG9ydCB7aXNJbnRlZ2VyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gTkdCX0RBVEVQSUNLRVJfVElNRV9BREFQVEVSX0ZBQ1RPUlkoKSB7XG4gIHJldHVybiBuZXcgTmdiVGltZVN0cnVjdEFkYXB0ZXIoKTtcbn1cblxuLyoqXG4gKiBBYnN0cmFjdCB0eXBlIHNlcnZpbmcgYXMgYSBESSB0b2tlbiBmb3IgdGhlIHNlcnZpY2UgY29udmVydGluZyBmcm9tIHlvdXIgYXBwbGljYXRpb24gVGltZSBtb2RlbCB0byBpbnRlcm5hbFxuICogTmdiVGltZVN0cnVjdCBtb2RlbC5cbiAqIEEgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBjb252ZXJ0aW5nIGZyb20gYW5kIHRvIE5nYlRpbWVTdHJ1Y3QgaXMgcHJvdmlkZWQgZm9yIHJldHJvLWNvbXBhdGliaWxpdHksXG4gKiBidXQgeW91IGNhbiBwcm92aWRlIGFub3RoZXIgaW1wbGVtZW50YXRpb24gdG8gdXNlIGFuIGFsdGVybmF0aXZlIGZvcm1hdCwgaWUgZm9yIHVzaW5nIHdpdGggbmF0aXZlIERhdGUgT2JqZWN0LlxuICpcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnLCB1c2VGYWN0b3J5OiBOR0JfREFURVBJQ0tFUl9USU1FX0FEQVBURVJfRkFDVE9SWX0pXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTmdiVGltZUFkYXB0ZXI8VD4ge1xuICAvKipcbiAgICogQ29udmVydHMgdXNlci1tb2RlbCBkYXRlIGludG8gYW4gTmdiVGltZVN0cnVjdCBmb3IgaW50ZXJuYWwgdXNlIGluIHRoZSBsaWJyYXJ5XG4gICAqL1xuICBhYnN0cmFjdCBmcm9tTW9kZWwodmFsdWU6IFQpOiBOZ2JUaW1lU3RydWN0O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBpbnRlcm5hbCB0aW1lIHZhbHVlIE5nYlRpbWVTdHJ1Y3QgdG8gdXNlci1tb2RlbCBkYXRlXG4gICAqIFRoZSByZXR1cm5lZCB0eXBlIGlzIHN1cHBvc2VkIHRvIGJlIG9mIHRoZSBzYW1lIHR5cGUgYXMgZnJvbU1vZGVsKCkgaW5wdXQtdmFsdWUgcGFyYW1cbiAgICovXG4gIGFic3RyYWN0IHRvTW9kZWwodGltZTogTmdiVGltZVN0cnVjdCk6IFQ7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JUaW1lU3RydWN0QWRhcHRlciBleHRlbmRzIE5nYlRpbWVBZGFwdGVyPE5nYlRpbWVTdHJ1Y3Q+IHtcbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgTmdiVGltZVN0cnVjdCB2YWx1ZSBpbnRvIE5nYlRpbWVTdHJ1Y3QgdmFsdWVcbiAgICovXG4gIGZyb21Nb2RlbCh0aW1lOiBOZ2JUaW1lU3RydWN0KTogTmdiVGltZVN0cnVjdCB7XG4gICAgcmV0dXJuICh0aW1lICYmIGlzSW50ZWdlcih0aW1lLmhvdXIpICYmIGlzSW50ZWdlcih0aW1lLm1pbnV0ZSkpID9cbiAgICAgICAge2hvdXI6IHRpbWUuaG91ciwgbWludXRlOiB0aW1lLm1pbnV0ZSwgc2Vjb25kOiBpc0ludGVnZXIodGltZS5zZWNvbmQpID8gdGltZS5zZWNvbmQgOiBudWxsfSA6XG4gICAgICAgIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBOZ2JUaW1lU3RydWN0IHZhbHVlIGludG8gTmdiVGltZVN0cnVjdCB2YWx1ZVxuICAgKi9cbiAgdG9Nb2RlbCh0aW1lOiBOZ2JUaW1lU3RydWN0KTogTmdiVGltZVN0cnVjdCB7XG4gICAgcmV0dXJuICh0aW1lICYmIGlzSW50ZWdlcih0aW1lLmhvdXIpICYmIGlzSW50ZWdlcih0aW1lLm1pbnV0ZSkpID9cbiAgICAgICAge2hvdXI6IHRpbWUuaG91ciwgbWludXRlOiB0aW1lLm1pbnV0ZSwgc2Vjb25kOiBpc0ludGVnZXIodGltZS5zZWNvbmQpID8gdGltZS5zZWNvbmQgOiBudWxsfSA6XG4gICAgICAgIG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCB7Q29tcG9uZW50LCBmb3J3YXJkUmVmLCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7aXNOdW1iZXIsIHBhZE51bWJlciwgdG9JbnRlZ2VyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JUaW1lfSBmcm9tICcuL25nYi10aW1lJztcbmltcG9ydCB7TmdiVGltZXBpY2tlckNvbmZpZ30gZnJvbSAnLi90aW1lcGlja2VyLWNvbmZpZyc7XG5pbXBvcnQge05nYlRpbWVBZGFwdGVyfSBmcm9tICcuL25nYi10aW1lLWFkYXB0ZXInO1xuXG5jb25zdCBOR0JfVElNRVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUiA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYlRpbWVwaWNrZXIpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBBIGxpZ2h0d2VpZ2h0ICYgY29uZmlndXJhYmxlIHRpbWVwaWNrZXIgZGlyZWN0aXZlLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItdGltZXBpY2tlcicsXG4gIHN0eWxlVXJsczogWycuL3RpbWVwaWNrZXIuc2NzcyddLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxmaWVsZHNldCBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJuZ2ItdHBcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5nYi10cC1pbnB1dC1jb250YWluZXIgbmdiLXRwLWhvdXJcIj5cbiAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwic3Bpbm5lcnNcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cImNoYW5nZUhvdXIoaG91clN0ZXApXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1saW5rXCIgW2NsYXNzLmJ0bi1zbV09XCJpc1NtYWxsU2l6ZVwiIFtjbGFzcy5idG4tbGddPVwiaXNMYXJnZVNpemVcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZXZyb25cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5pbmNyZW1lbnQtaG91cnNcIj5JbmNyZW1lbnQgaG91cnM8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBbY2xhc3MuZm9ybS1jb250cm9sLXNtXT1cImlzU21hbGxTaXplXCIgW2NsYXNzLmZvcm0tY29udHJvbC1sZ109XCJpc0xhcmdlU2l6ZVwiIG1heGxlbmd0aD1cIjJcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJISFwiIGkxOG4tcGxhY2Vob2xkZXI9XCJAQG5nYi50aW1lcGlja2VyLkhIXCJcbiAgICAgICAgICAgIFt2YWx1ZV09XCJmb3JtYXRIb3VyKG1vZGVsPy5ob3VyKVwiIChjaGFuZ2UpPVwidXBkYXRlSG91cigkZXZlbnQudGFyZ2V0LnZhbHVlKVwiXG4gICAgICAgICAgICBbcmVhZG9ubHldPVwicmVhZG9ubHlJbnB1dHNcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBhcmlhLWxhYmVsPVwiSG91cnNcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi50aW1lcGlja2VyLmhvdXJzXCI+XG4gICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInNwaW5uZXJzXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJjaGFuZ2VIb3VyKC1ob3VyU3RlcClcIlxuICAgICAgICAgICAgY2xhc3M9XCJidG4gYnRuLWxpbmtcIiBbY2xhc3MuYnRuLXNtXT1cImlzU21hbGxTaXplXCIgW2NsYXNzLmJ0bi1sZ109XCJpc0xhcmdlU2l6ZVwiIFtjbGFzcy5kaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hldnJvbiBib3R0b21cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5kZWNyZW1lbnQtaG91cnNcIj5EZWNyZW1lbnQgaG91cnM8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmdiLXRwLXNwYWNlclwiPjo8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5nYi10cC1pbnB1dC1jb250YWluZXIgbmdiLXRwLW1pbnV0ZVwiPlxuICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJzcGlubmVyc1wiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiY2hhbmdlTWludXRlKG1pbnV0ZVN0ZXApXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1saW5rXCIgW2NsYXNzLmJ0bi1zbV09XCJpc1NtYWxsU2l6ZVwiIFtjbGFzcy5idG4tbGddPVwiaXNMYXJnZVNpemVcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZXZyb25cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5pbmNyZW1lbnQtbWludXRlc1wiPkluY3JlbWVudCBtaW51dGVzPC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgW2NsYXNzLmZvcm0tY29udHJvbC1zbV09XCJpc1NtYWxsU2l6ZVwiIFtjbGFzcy5mb3JtLWNvbnRyb2wtbGddPVwiaXNMYXJnZVNpemVcIiBtYXhsZW5ndGg9XCIyXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTU1cIiBpMThuLXBsYWNlaG9sZGVyPVwiQEBuZ2IudGltZXBpY2tlci5NTVwiXG4gICAgICAgICAgICBbdmFsdWVdPVwiZm9ybWF0TWluU2VjKG1vZGVsPy5taW51dGUpXCIgKGNoYW5nZSk9XCJ1cGRhdGVNaW51dGUoJGV2ZW50LnRhcmdldC52YWx1ZSlcIlxuICAgICAgICAgICAgW3JlYWRvbmx5XT1cInJlYWRvbmx5SW5wdXRzXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgYXJpYS1sYWJlbD1cIk1pbnV0ZXNcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi50aW1lcGlja2VyLm1pbnV0ZXNcIj5cbiAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwic3Bpbm5lcnNcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cImNoYW5nZU1pbnV0ZSgtbWludXRlU3RlcClcIlxuICAgICAgICAgICAgY2xhc3M9XCJidG4gYnRuLWxpbmtcIiBbY2xhc3MuYnRuLXNtXT1cImlzU21hbGxTaXplXCIgW2NsYXNzLmJ0bi1sZ109XCJpc0xhcmdlU2l6ZVwiICBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZXZyb24gYm90dG9tXCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCIgIGkxOG49XCJAQG5nYi50aW1lcGlja2VyLmRlY3JlbWVudC1taW51dGVzXCI+RGVjcmVtZW50IG1pbnV0ZXM8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0lmPVwic2Vjb25kc1wiIGNsYXNzPVwibmdiLXRwLXNwYWNlclwiPjo8L2Rpdj5cbiAgICAgICAgPGRpdiAqbmdJZj1cInNlY29uZHNcIiBjbGFzcz1cIm5nYi10cC1pbnB1dC1jb250YWluZXIgbmdiLXRwLXNlY29uZFwiPlxuICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJzcGlubmVyc1wiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiY2hhbmdlU2Vjb25kKHNlY29uZFN0ZXApXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1saW5rXCIgW2NsYXNzLmJ0bi1zbV09XCJpc1NtYWxsU2l6ZVwiIFtjbGFzcy5idG4tbGddPVwiaXNMYXJnZVNpemVcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZXZyb25cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5pbmNyZW1lbnQtc2Vjb25kc1wiPkluY3JlbWVudCBzZWNvbmRzPC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgW2NsYXNzLmZvcm0tY29udHJvbC1zbV09XCJpc1NtYWxsU2l6ZVwiIFtjbGFzcy5mb3JtLWNvbnRyb2wtbGddPVwiaXNMYXJnZVNpemVcIiBtYXhsZW5ndGg9XCIyXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU1NcIiBpMThuLXBsYWNlaG9sZGVyPVwiQEBuZ2IudGltZXBpY2tlci5TU1wiXG4gICAgICAgICAgICBbdmFsdWVdPVwiZm9ybWF0TWluU2VjKG1vZGVsPy5zZWNvbmQpXCIgKGNoYW5nZSk9XCJ1cGRhdGVTZWNvbmQoJGV2ZW50LnRhcmdldC52YWx1ZSlcIlxuICAgICAgICAgICAgW3JlYWRvbmx5XT1cInJlYWRvbmx5SW5wdXRzXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgYXJpYS1sYWJlbD1cIlNlY29uZHNcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi50aW1lcGlja2VyLnNlY29uZHNcIj5cbiAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwic3Bpbm5lcnNcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cImNoYW5nZVNlY29uZCgtc2Vjb25kU3RlcClcIlxuICAgICAgICAgICAgY2xhc3M9XCJidG4gYnRuLWxpbmtcIiBbY2xhc3MuYnRuLXNtXT1cImlzU21hbGxTaXplXCIgW2NsYXNzLmJ0bi1sZ109XCJpc0xhcmdlU2l6ZVwiICBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZXZyb24gYm90dG9tXCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCIgaTE4bj1cIkBAbmdiLnRpbWVwaWNrZXIuZGVjcmVtZW50LXNlY29uZHNcIj5EZWNyZW1lbnQgc2Vjb25kczwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgKm5nSWY9XCJtZXJpZGlhblwiIGNsYXNzPVwibmdiLXRwLXNwYWNlclwiPjwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0lmPVwibWVyaWRpYW5cIiBjbGFzcz1cIm5nYi10cC1tZXJpZGlhblwiPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1vdXRsaW5lLXByaW1hcnlcIiBbY2xhc3MuYnRuLXNtXT1cImlzU21hbGxTaXplXCIgW2NsYXNzLmJ0bi1sZ109XCJpc0xhcmdlU2l6ZVwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cInRvZ2dsZU1lcmlkaWFuKClcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJtb2RlbD8uaG91ciA+PSAxMjsgZWxzZSBhbVwiIGkxOG49XCJAQG5nYi50aW1lcGlja2VyLlBNXCI+UE08L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjYW0gaTE4bj1cIkBAbmdiLnRpbWVwaWNrZXIuQU1cIj5BTTwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9maWVsZHNldD5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbTkdCX1RJTUVQSUNLRVJfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIE5nYlRpbWVwaWNrZXIgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICBPbkNoYW5nZXMge1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgbW9kZWw6IE5nYlRpbWU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzcGxheSAxMkggb3IgMjRIIG1vZGUuXG4gICAqL1xuICBASW5wdXQoKSBtZXJpZGlhbjogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBkaXNwbGF5IHRoZSBzcGlubmVycyBhYm92ZSBhbmQgYmVsb3cgdGhlIGlucHV0cy5cbiAgICovXG4gIEBJbnB1dCgpIHNwaW5uZXJzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc3BsYXkgc2Vjb25kcyBpbnB1dC5cbiAgICovXG4gIEBJbnB1dCgpIHNlY29uZHM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiBob3VycyB0byBpbmNyZWFzZSBvciBkZWNyZWFzZSB3aGVuIHVzaW5nIGEgYnV0dG9uLlxuICAgKi9cbiAgQElucHV0KCkgaG91clN0ZXA6IG51bWJlcjtcblxuICAvKipcbiAgICogTnVtYmVyIG9mIG1pbnV0ZXMgdG8gaW5jcmVhc2Ugb3IgZGVjcmVhc2Ugd2hlbiB1c2luZyBhIGJ1dHRvbi5cbiAgICovXG4gIEBJbnB1dCgpIG1pbnV0ZVN0ZXA6IG51bWJlcjtcblxuICAvKipcbiAgICogTnVtYmVyIG9mIHNlY29uZHMgdG8gaW5jcmVhc2Ugb3IgZGVjcmVhc2Ugd2hlbiB1c2luZyBhIGJ1dHRvbi5cbiAgICovXG4gIEBJbnB1dCgpIHNlY29uZFN0ZXA6IG51bWJlcjtcblxuICAvKipcbiAgICogVG8gbWFrZSB0aW1lcGlja2VyIHJlYWRvbmx5XG4gICAqL1xuICBASW5wdXQoKSByZWFkb25seUlucHV0czogYm9vbGVhbjtcblxuICAvKipcbiAgICogVG8gc2V0IHRoZSBzaXplIG9mIHRoZSBpbnB1dHMgYW5kIGJ1dHRvblxuICAgKi9cbiAgQElucHV0KCkgc2l6ZTogJ3NtYWxsJyB8ICdtZWRpdW0nIHwgJ2xhcmdlJztcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE5nYlRpbWVwaWNrZXJDb25maWcsIHByaXZhdGUgX25nYlRpbWVBZGFwdGVyOiBOZ2JUaW1lQWRhcHRlcjxhbnk+KSB7XG4gICAgdGhpcy5tZXJpZGlhbiA9IGNvbmZpZy5tZXJpZGlhbjtcbiAgICB0aGlzLnNwaW5uZXJzID0gY29uZmlnLnNwaW5uZXJzO1xuICAgIHRoaXMuc2Vjb25kcyA9IGNvbmZpZy5zZWNvbmRzO1xuICAgIHRoaXMuaG91clN0ZXAgPSBjb25maWcuaG91clN0ZXA7XG4gICAgdGhpcy5taW51dGVTdGVwID0gY29uZmlnLm1pbnV0ZVN0ZXA7XG4gICAgdGhpcy5zZWNvbmRTdGVwID0gY29uZmlnLnNlY29uZFN0ZXA7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGNvbmZpZy5kaXNhYmxlZDtcbiAgICB0aGlzLnJlYWRvbmx5SW5wdXRzID0gY29uZmlnLnJlYWRvbmx5SW5wdXRzO1xuICAgIHRoaXMuc2l6ZSA9IGNvbmZpZy5zaXplO1xuICB9XG5cbiAgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcbiAgb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgIGNvbnN0IHN0cnVjdFZhbHVlID0gdGhpcy5fbmdiVGltZUFkYXB0ZXIuZnJvbU1vZGVsKHZhbHVlKTtcbiAgICB0aGlzLm1vZGVsID0gc3RydWN0VmFsdWUgPyBuZXcgTmdiVGltZShzdHJ1Y3RWYWx1ZS5ob3VyLCBzdHJ1Y3RWYWx1ZS5taW51dGUsIHN0cnVjdFZhbHVlLnNlY29uZCkgOiBuZXcgTmdiVGltZSgpO1xuICAgIGlmICghdGhpcy5zZWNvbmRzICYmICghc3RydWN0VmFsdWUgfHwgIWlzTnVtYmVyKHN0cnVjdFZhbHVlLnNlY29uZCkpKSB7XG4gICAgICB0aGlzLm1vZGVsLnNlY29uZCA9IDA7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uQ2hhbmdlID0gZm47IH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gYW55KTogdm9pZCB7IHRoaXMub25Ub3VjaGVkID0gZm47IH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHsgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7IH1cblxuICBjaGFuZ2VIb3VyKHN0ZXA6IG51bWJlcikge1xuICAgIHRoaXMubW9kZWwuY2hhbmdlSG91cihzdGVwKTtcbiAgICB0aGlzLnByb3BhZ2F0ZU1vZGVsQ2hhbmdlKCk7XG4gIH1cblxuICBjaGFuZ2VNaW51dGUoc3RlcDogbnVtYmVyKSB7XG4gICAgdGhpcy5tb2RlbC5jaGFuZ2VNaW51dGUoc3RlcCk7XG4gICAgdGhpcy5wcm9wYWdhdGVNb2RlbENoYW5nZSgpO1xuICB9XG5cbiAgY2hhbmdlU2Vjb25kKHN0ZXA6IG51bWJlcikge1xuICAgIHRoaXMubW9kZWwuY2hhbmdlU2Vjb25kKHN0ZXApO1xuICAgIHRoaXMucHJvcGFnYXRlTW9kZWxDaGFuZ2UoKTtcbiAgfVxuXG4gIHVwZGF0ZUhvdXIobmV3VmFsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBpc1BNID0gdGhpcy5tb2RlbC5ob3VyID49IDEyO1xuICAgIGNvbnN0IGVudGVyZWRIb3VyID0gdG9JbnRlZ2VyKG5ld1ZhbCk7XG4gICAgaWYgKHRoaXMubWVyaWRpYW4gJiYgKGlzUE0gJiYgZW50ZXJlZEhvdXIgPCAxMiB8fCAhaXNQTSAmJiBlbnRlcmVkSG91ciA9PT0gMTIpKSB7XG4gICAgICB0aGlzLm1vZGVsLnVwZGF0ZUhvdXIoZW50ZXJlZEhvdXIgKyAxMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubW9kZWwudXBkYXRlSG91cihlbnRlcmVkSG91cik7XG4gICAgfVxuICAgIHRoaXMucHJvcGFnYXRlTW9kZWxDaGFuZ2UoKTtcbiAgfVxuXG4gIHVwZGF0ZU1pbnV0ZShuZXdWYWw6IHN0cmluZykge1xuICAgIHRoaXMubW9kZWwudXBkYXRlTWludXRlKHRvSW50ZWdlcihuZXdWYWwpKTtcbiAgICB0aGlzLnByb3BhZ2F0ZU1vZGVsQ2hhbmdlKCk7XG4gIH1cblxuICB1cGRhdGVTZWNvbmQobmV3VmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1vZGVsLnVwZGF0ZVNlY29uZCh0b0ludGVnZXIobmV3VmFsKSk7XG4gICAgdGhpcy5wcm9wYWdhdGVNb2RlbENoYW5nZSgpO1xuICB9XG5cbiAgdG9nZ2xlTWVyaWRpYW4oKSB7XG4gICAgaWYgKHRoaXMubWVyaWRpYW4pIHtcbiAgICAgIHRoaXMuY2hhbmdlSG91cigxMik7XG4gICAgfVxuICB9XG5cbiAgZm9ybWF0SG91cih2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKGlzTnVtYmVyKHZhbHVlKSkge1xuICAgICAgaWYgKHRoaXMubWVyaWRpYW4pIHtcbiAgICAgICAgcmV0dXJuIHBhZE51bWJlcih2YWx1ZSAlIDEyID09PSAwID8gMTIgOiB2YWx1ZSAlIDEyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYWROdW1iZXIodmFsdWUgJSAyNCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYWROdW1iZXIoTmFOKTtcbiAgICB9XG4gIH1cblxuICBmb3JtYXRNaW5TZWModmFsdWU6IG51bWJlcikgeyByZXR1cm4gcGFkTnVtYmVyKHZhbHVlKTsgfVxuXG4gIGdldCBpc1NtYWxsU2l6ZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc2l6ZSA9PT0gJ3NtYWxsJzsgfVxuXG4gIGdldCBpc0xhcmdlU2l6ZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc2l6ZSA9PT0gJ2xhcmdlJzsgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlc1snc2Vjb25kcyddICYmICF0aGlzLnNlY29uZHMgJiYgdGhpcy5tb2RlbCAmJiAhaXNOdW1iZXIodGhpcy5tb2RlbC5zZWNvbmQpKSB7XG4gICAgICB0aGlzLm1vZGVsLnNlY29uZCA9IDA7XG4gICAgICB0aGlzLnByb3BhZ2F0ZU1vZGVsQ2hhbmdlKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHByb3BhZ2F0ZU1vZGVsQ2hhbmdlKHRvdWNoZWQgPSB0cnVlKSB7XG4gICAgaWYgKHRvdWNoZWQpIHtcbiAgICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1vZGVsLmlzVmFsaWQodGhpcy5zZWNvbmRzKSkge1xuICAgICAgdGhpcy5vbkNoYW5nZShcbiAgICAgICAgICB0aGlzLl9uZ2JUaW1lQWRhcHRlci50b01vZGVsKHtob3VyOiB0aGlzLm1vZGVsLmhvdXIsIG1pbnV0ZTogdGhpcy5tb2RlbC5taW51dGUsIHNlY29uZDogdGhpcy5tb2RlbC5zZWNvbmR9KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25DaGFuZ2UodGhpcy5fbmdiVGltZUFkYXB0ZXIudG9Nb2RlbChudWxsKSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge05nYlRpbWVwaWNrZXJ9IGZyb20gJy4vdGltZXBpY2tlcic7XG5cbmV4cG9ydCB7TmdiVGltZXBpY2tlcn0gZnJvbSAnLi90aW1lcGlja2VyJztcbmV4cG9ydCB7TmdiVGltZXBpY2tlckNvbmZpZ30gZnJvbSAnLi90aW1lcGlja2VyLWNvbmZpZyc7XG5leHBvcnQge05nYlRpbWVTdHJ1Y3R9IGZyb20gJy4vbmdiLXRpbWUtc3RydWN0JztcbmV4cG9ydCB7TmdiVGltZUFkYXB0ZXJ9IGZyb20gJy4vbmdiLXRpbWUtYWRhcHRlcic7XG5cbkBOZ01vZHVsZSh7ZGVjbGFyYXRpb25zOiBbTmdiVGltZXBpY2tlcl0sIGV4cG9ydHM6IFtOZ2JUaW1lcGlja2VyXSwgaW1wb3J0czogW0NvbW1vbk1vZHVsZV19KVxuZXhwb3J0IGNsYXNzIE5nYlRpbWVwaWNrZXJNb2R1bGUge1xuICAvKipcbiAgICogSW1wb3J0aW5nIHdpdGggJy5mb3JSb290KCknIGlzIG5vIGxvbmdlciBuZWNlc3NhcnksIHlvdSBjYW4gc2ltcGx5IGltcG9ydCB0aGUgbW9kdWxlLlxuICAgKiBXaWxsIGJlIHJlbW92ZWQgaW4gNC4wLjAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiVGltZXBpY2tlck1vZHVsZX07IH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsYWNlbWVudEFycmF5fSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHNlcnZpY2UgZm9yIHRoZSBOZ2JUb29sdGlwIGRpcmVjdGl2ZS5cbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSB0b29sdGlwcyB1c2VkIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiVG9vbHRpcENvbmZpZyB7XG4gIGF1dG9DbG9zZTogYm9vbGVhbiB8ICdpbnNpZGUnIHwgJ291dHNpZGUnID0gdHJ1ZTtcbiAgcGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSA9ICd0b3AnO1xuICB0cmlnZ2VycyA9ICdob3Zlcic7XG4gIGNvbnRhaW5lcjogc3RyaW5nO1xuICBkaXNhYmxlVG9vbHRpcCA9IGZhbHNlO1xuICB0b29sdGlwQ2xhc3M6IHN0cmluZztcbn1cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgUmVuZGVyZXIyLFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIE5nWm9uZSxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge2Zyb21FdmVudCwgcmFjZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7bGlzdGVuVG9UcmlnZ2Vyc30gZnJvbSAnLi4vdXRpbC90cmlnZ2Vycyc7XG5pbXBvcnQge3Bvc2l0aW9uRWxlbWVudHMsIFBsYWNlbWVudCwgUGxhY2VtZW50QXJyYXl9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmcnO1xuaW1wb3J0IHtQb3B1cFNlcnZpY2V9IGZyb20gJy4uL3V0aWwvcG9wdXAnO1xuaW1wb3J0IHtLZXl9IGZyb20gJy4uL3V0aWwva2V5JztcblxuaW1wb3J0IHtOZ2JUb29sdGlwQ29uZmlnfSBmcm9tICcuL3Rvb2x0aXAtY29uZmlnJztcblxubGV0IG5leHRJZCA9IDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi10b29sdGlwLXdpbmRvdycsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzc10nOlxuICAgICAgICAnXCJ0b29sdGlwIHNob3cgYnMtdG9vbHRpcC1cIiArIHBsYWNlbWVudC5zcGxpdChcIi1cIilbMF0rXCIgYnMtdG9vbHRpcC1cIiArIHBsYWNlbWVudCArICh0b29sdGlwQ2xhc3MgPyBcIiBcIiArIHRvb2x0aXBDbGFzcyA6IFwiXCIpJyxcbiAgICAncm9sZSc6ICd0b29sdGlwJyxcbiAgICAnW2lkXSc6ICdpZCdcbiAgfSxcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiYXJyb3dcIj48L2Rpdj48ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L2Rpdj5gLFxuICBzdHlsZVVybHM6IFsnLi90b29sdGlwLnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JUb29sdGlwV2luZG93IHtcbiAgQElucHV0KCkgcGxhY2VtZW50OiBQbGFjZW1lbnQgPSAndG9wJztcbiAgQElucHV0KCkgaWQ6IHN0cmluZztcbiAgQElucHV0KCkgdG9vbHRpcENsYXNzOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIpIHt9XG5cbiAgYXBwbHlQbGFjZW1lbnQoX3BsYWNlbWVudDogUGxhY2VtZW50KSB7XG4gICAgLy8gcmVtb3ZlIHRoZSBjdXJyZW50IHBsYWNlbWVudCBjbGFzc2VzXG4gICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnYnMtdG9vbHRpcC0nICsgdGhpcy5wbGFjZW1lbnQudG9TdHJpbmcoKS5zcGxpdCgnLScpWzBdKTtcbiAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdicy10b29sdGlwLScgKyB0aGlzLnBsYWNlbWVudC50b1N0cmluZygpKTtcblxuICAgIC8vIHNldCB0aGUgbmV3IHBsYWNlbWVudCBjbGFzc2VzXG4gICAgdGhpcy5wbGFjZW1lbnQgPSBfcGxhY2VtZW50O1xuXG4gICAgLy8gYXBwbHkgdGhlIG5ldyBwbGFjZW1lbnRcbiAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdicy10b29sdGlwLScgKyB0aGlzLnBsYWNlbWVudC50b1N0cmluZygpLnNwbGl0KCctJylbMF0pO1xuICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2JzLXRvb2x0aXAtJyArIHRoaXMucGxhY2VtZW50LnRvU3RyaW5nKCkpO1xuICB9XG4gIC8qKlxuICAgKiBUZWxscyB3aGV0aGVyIHRoZSBldmVudCBoYXMgYmVlbiB0cmlnZ2VyZWQgZnJvbSB0aGlzIGNvbXBvbmVudCdzIHN1YnRyZWUgb3Igbm90LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgdGhlIGV2ZW50IHRvIGNoZWNrXG4gICAqXG4gICAqIEByZXR1cm4gd2hldGhlciB0aGUgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkIGZyb20gdGhpcyBjb21wb25lbnQncyBzdWJ0cmVlIG9yIG5vdC5cbiAgICovXG4gIGlzRXZlbnRGcm9tKGV2ZW50OiBFdmVudCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCk7IH1cbn1cblxuLyoqXG4gKiBBIGxpZ2h0d2VpZ2h0LCBleHRlbnNpYmxlIGRpcmVjdGl2ZSBmb3IgZmFuY3kgdG9vbHRpcCBjcmVhdGlvbi5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbbmdiVG9vbHRpcF0nLCBleHBvcnRBczogJ25nYlRvb2x0aXAnfSlcbmV4cG9ydCBjbGFzcyBOZ2JUb29sdGlwIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHRvb2x0aXAgc2hvdWxkIGJlIGNsb3NlZCBvbiBFc2NhcGUga2V5IGFuZCBpbnNpZGUvb3V0c2lkZSBjbGlja3MuXG4gICAqXG4gICAqIC0gdHJ1ZSAoZGVmYXVsdCk6IGNsb3NlcyBvbiBib3RoIG91dHNpZGUgYW5kIGluc2lkZSBjbGlja3MgYXMgd2VsbCBhcyBFc2NhcGUgcHJlc3Nlc1xuICAgKiAtIGZhbHNlOiBkaXNhYmxlcyB0aGUgYXV0b0Nsb3NlIGZlYXR1cmUgKE5COiB0cmlnZ2VycyBzdGlsbCBhcHBseSlcbiAgICogLSAnaW5zaWRlJzogY2xvc2VzIG9uIGluc2lkZSBjbGlja3MgYXMgd2VsbCBhcyBFc2NhcGUgcHJlc3Nlc1xuICAgKiAtICdvdXRzaWRlJzogY2xvc2VzIG9uIG91dHNpZGUgY2xpY2tzIChzb21ldGltZXMgYWxzbyBhY2hpZXZhYmxlIHRocm91Z2ggdHJpZ2dlcnMpXG4gICAqIGFzIHdlbGwgYXMgRXNjYXBlIHByZXNzZXNcbiAgICpcbiAgICogQHNpbmNlIDMuMC4wXG4gICAqL1xuICBASW5wdXQoKSBhdXRvQ2xvc2U6IGJvb2xlYW4gfCAnaW5zaWRlJyB8ICdvdXRzaWRlJztcbiAgLyoqXG4gICAgKiBQbGFjZW1lbnQgb2YgYSB0b29sdGlwIGFjY2VwdHM6XG4gICAgKiAgICBcInRvcFwiLCBcInRvcC1sZWZ0XCIsIFwidG9wLXJpZ2h0XCIsIFwiYm90dG9tXCIsIFwiYm90dG9tLWxlZnRcIiwgXCJib3R0b20tcmlnaHRcIixcbiAgICAqICAgIFwibGVmdFwiLCBcImxlZnQtdG9wXCIsIFwibGVmdC1ib3R0b21cIiwgXCJyaWdodFwiLCBcInJpZ2h0LXRvcFwiLCBcInJpZ2h0LWJvdHRvbVwiXG4gICAgKiBhbmQgYXJyYXkgb2YgYWJvdmUgdmFsdWVzLlxuICAgICovXG4gIEBJbnB1dCgpIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXk7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgZXZlbnRzIHRoYXQgc2hvdWxkIHRyaWdnZXIuIFN1cHBvcnRzIGEgc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgZXZlbnQgbmFtZXMuXG4gICAqL1xuICBASW5wdXQoKSB0cmlnZ2Vyczogc3RyaW5nO1xuICAvKipcbiAgICogQSBzZWxlY3RvciBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSB0b29sdGlwIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cbiAgICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgXCJib2R5XCIuXG4gICAqL1xuICBASW5wdXQoKSBjb250YWluZXI6IHN0cmluZztcbiAgLyoqXG4gICAqIEEgZmxhZyBpbmRpY2F0aW5nIGlmIGEgZ2l2ZW4gdG9vbHRpcCBpcyBkaXNhYmxlZCBhbmQgc2hvdWxkIG5vdCBiZSBkaXNwbGF5ZWQuXG4gICAqXG4gICAqIEBzaW5jZSAxLjEuMFxuICAgKi9cbiAgQElucHV0KCkgZGlzYWJsZVRvb2x0aXA6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBjbGFzcyBhcHBsaWVkIHRvIG5nYi10b29sdGlwLXdpbmRvd1xuICAgKlxuICAgKiBAc2luY2UgMy4yLjBcbiAgICovXG4gIEBJbnB1dCgpIHRvb2x0aXBDbGFzczogc3RyaW5nO1xuICAvKipcbiAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiB0aGUgdG9vbHRpcCBpcyBzaG93blxuICAgKi9cbiAgQE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAvKipcbiAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiB0aGUgdG9vbHRpcCBpcyBoaWRkZW5cbiAgICovXG4gIEBPdXRwdXQoKSBoaWRkZW4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJpdmF0ZSBfbmdiVG9vbHRpcDogc3RyaW5nIHwgVGVtcGxhdGVSZWY8YW55PjtcbiAgcHJpdmF0ZSBfbmdiVG9vbHRpcFdpbmRvd0lkID0gYG5nYi10b29sdGlwLSR7bmV4dElkKyt9YDtcbiAgcHJpdmF0ZSBfcG9wdXBTZXJ2aWNlOiBQb3B1cFNlcnZpY2U8TmdiVG9vbHRpcFdpbmRvdz47XG4gIHByaXZhdGUgX3dpbmRvd1JlZjogQ29tcG9uZW50UmVmPE5nYlRvb2x0aXBXaW5kb3c+O1xuICBwcml2YXRlIF91bnJlZ2lzdGVyTGlzdGVuZXJzRm47XG4gIHByaXZhdGUgX3pvbmVTdWJzY3JpcHRpb246IGFueTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZiwgY29uZmlnOiBOZ2JUb29sdGlwQ29uZmlnLFxuICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnkpIHtcbiAgICB0aGlzLmF1dG9DbG9zZSA9IGNvbmZpZy5hdXRvQ2xvc2U7XG4gICAgdGhpcy5wbGFjZW1lbnQgPSBjb25maWcucGxhY2VtZW50O1xuICAgIHRoaXMudHJpZ2dlcnMgPSBjb25maWcudHJpZ2dlcnM7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb25maWcuY29udGFpbmVyO1xuICAgIHRoaXMuZGlzYWJsZVRvb2x0aXAgPSBjb25maWcuZGlzYWJsZVRvb2x0aXA7XG4gICAgdGhpcy50b29sdGlwQ2xhc3MgPSBjb25maWcudG9vbHRpcENsYXNzO1xuICAgIHRoaXMuX3BvcHVwU2VydmljZSA9IG5ldyBQb3B1cFNlcnZpY2U8TmdiVG9vbHRpcFdpbmRvdz4oXG4gICAgICAgIE5nYlRvb2x0aXBXaW5kb3csIGluamVjdG9yLCB2aWV3Q29udGFpbmVyUmVmLCBfcmVuZGVyZXIsIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcik7XG5cbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uID0gX25nWm9uZS5vblN0YWJsZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX3dpbmRvd1JlZikge1xuICAgICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuYXBwbHlQbGFjZW1lbnQoXG4gICAgICAgICAgICBwb3NpdGlvbkVsZW1lbnRzKFxuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsIHRoaXMucGxhY2VtZW50LFxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID09PSAnYm9keScpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb250ZW50IHRvIGJlIGRpc3BsYXllZCBhcyB0b29sdGlwLiBJZiBmYWxzeSwgdGhlIHRvb2x0aXAgd29uJ3Qgb3Blbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBuZ2JUb29sdGlwKHZhbHVlOiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjxhbnk+KSB7XG4gICAgdGhpcy5fbmdiVG9vbHRpcCA9IHZhbHVlO1xuICAgIGlmICghdmFsdWUgJiYgdGhpcy5fd2luZG93UmVmKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG5nYlRvb2x0aXAoKSB7IHJldHVybiB0aGlzLl9uZ2JUb29sdGlwOyB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGFuIGVsZW1lbnTDosKAwplzIHRvb2x0aXAuIFRoaXMgaXMgY29uc2lkZXJlZCBhIMOiwoDCnG1hbnVhbMOiwoDCnSB0cmlnZ2VyaW5nIG9mIHRoZSB0b29sdGlwLlxuICAgKiBUaGUgY29udGV4dCBpcyBhbiBvcHRpb25hbCB2YWx1ZSB0byBiZSBpbmplY3RlZCBpbnRvIHRoZSB0b29sdGlwIHRlbXBsYXRlIHdoZW4gaXQgaXMgY3JlYXRlZC5cbiAgICovXG4gIG9wZW4oY29udGV4dD86IGFueSkge1xuICAgIGlmICghdGhpcy5fd2luZG93UmVmICYmIHRoaXMuX25nYlRvb2x0aXAgJiYgIXRoaXMuZGlzYWJsZVRvb2x0aXApIHtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZiA9IHRoaXMuX3BvcHVwU2VydmljZS5vcGVuKHRoaXMuX25nYlRvb2x0aXAsIGNvbnRleHQpO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLnRvb2x0aXBDbGFzcyA9IHRoaXMudG9vbHRpcENsYXNzO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmlkID0gdGhpcy5fbmdiVG9vbHRpcFdpbmRvd0lkO1xuXG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnYXJpYS1kZXNjcmliZWRieScsIHRoaXMuX25nYlRvb2x0aXBXaW5kb3dJZCk7XG5cbiAgICAgIGlmICh0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKSB7XG4gICAgICAgIHRoaXMuX2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jb250YWluZXIpLmFwcGVuZENoaWxkKHRoaXMuX3dpbmRvd1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLnBsYWNlbWVudCA9IEFycmF5LmlzQXJyYXkodGhpcy5wbGFjZW1lbnQpID8gdGhpcy5wbGFjZW1lbnRbMF0gOiB0aGlzLnBsYWNlbWVudDtcblxuICAgICAgLy8gYXBwbHkgc3R5bGluZyB0byBzZXQgYmFzaWMgY3NzLWNsYXNzZXMgb24gdGFyZ2V0IGVsZW1lbnQsIGJlZm9yZSBnb2luZyBmb3IgcG9zaXRpb25pbmdcbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93aW5kb3dSZWYuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgIC8vIHBvc2l0aW9uIHRvb2x0aXAgYWxvbmcgdGhlIGVsZW1lbnRcbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5hcHBseVBsYWNlbWVudChcbiAgICAgICAgICBwb3NpdGlvbkVsZW1lbnRzKFxuICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX3dpbmRvd1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LCB0aGlzLnBsYWNlbWVudCxcbiAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPT09ICdib2R5JykpO1xuXG4gICAgICBpZiAodGhpcy5hdXRvQ2xvc2UpIHtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAvLyBwcmV2ZW50cyBhdXRvbWF0aWMgY2xvc2luZyByaWdodCBhZnRlciBhbiBvcGVuaW5nIGJ5IHB1dHRpbmcgYSBndWFyZCBmb3IgdGhlIHRpbWUgb2Ygb25lIGV2ZW50IGhhbmRsaW5nXG4gICAgICAgICAgLy8gcGFzc1xuICAgICAgICAgIC8vIHVzZSBjYXNlOiBjbGljayBldmVudCB3b3VsZCByZWFjaCBhbiBlbGVtZW50IG9wZW5pbmcgdGhlIHRvb2x0aXAgZmlyc3QsIHRoZW4gcmVhY2ggdGhlIGF1dG9DbG9zZSBoYW5kbGVyXG4gICAgICAgICAgLy8gd2hpY2ggd291bGQgY2xvc2UgaXRcbiAgICAgICAgICBsZXQganVzdE9wZW5lZCA9IHRydWU7XG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGp1c3RPcGVuZWQgPSBmYWxzZSk7XG5cbiAgICAgICAgICBjb25zdCBlc2NhcGVzJCA9IGZyb21FdmVudDxLZXlib2FyZEV2ZW50Pih0aGlzLl9kb2N1bWVudCwgJ2tleXVwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuaGlkZGVuKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRlcHJlY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcihldmVudCA9PiBldmVudC53aGljaCA9PT0gS2V5LkVzY2FwZSkpO1xuXG4gICAgICAgICAgY29uc3QgY2xpY2tzJCA9IGZyb21FdmVudDxNb3VzZUV2ZW50Pih0aGlzLl9kb2N1bWVudCwgJ2NsaWNrJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLmhpZGRlbiksIGZpbHRlcigoKSA9PiAhanVzdE9wZW5lZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyKGV2ZW50ID0+IHRoaXMuX3Nob3VsZENsb3NlRnJvbUNsaWNrKGV2ZW50KSkpO1xuXG4gICAgICAgICAgcmFjZTxFdmVudD4oW2VzY2FwZXMkLCBjbGlja3MkXSkuc3Vic2NyaWJlKCgpID0+IHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5jbG9zZSgpKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNob3duLmVtaXQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIGFuIGVsZW1lbnTDosKAwplzIHRvb2x0aXAuIFRoaXMgaXMgY29uc2lkZXJlZCBhIMOiwoDCnG1hbnVhbMOiwoDCnSB0cmlnZ2VyaW5nIG9mIHRoZSB0b29sdGlwLlxuICAgKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3dpbmRvd1JlZiAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgdGhpcy5fcG9wdXBTZXJ2aWNlLmNsb3NlKCk7XG4gICAgICB0aGlzLl93aW5kb3dSZWYgPSBudWxsO1xuICAgICAgdGhpcy5oaWRkZW4uZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIGFuIGVsZW1lbnTDosKAwplzIHRvb2x0aXAuIFRoaXMgaXMgY29uc2lkZXJlZCBhIMOiwoDCnG1hbnVhbMOiwoDCnSB0cmlnZ2VyaW5nIG9mIHRoZSB0b29sdGlwLlxuICAgKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl93aW5kb3dSZWYpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIHRvb2x0aXAgaXMgY3VycmVudGx5IGJlaW5nIHNob3duXG4gICAqL1xuICBpc09wZW4oKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl93aW5kb3dSZWYgIT0gbnVsbDsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbiA9IGxpc3RlblRvVHJpZ2dlcnMoXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMudHJpZ2dlcnMsIHRoaXMub3Blbi5iaW5kKHRoaXMpLCB0aGlzLmNsb3NlLmJpbmQodGhpcyksXG4gICAgICAgIHRoaXMudG9nZ2xlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIC8vIFRoaXMgY2hlY2sgaXMgbmVlZGVkIGFzIGl0IG1pZ2h0IGhhcHBlbiB0aGF0IG5nT25EZXN0cm95IGlzIGNhbGxlZCBiZWZvcmUgbmdPbkluaXRcbiAgICAvLyB1bmRlciBjZXJ0YWluIGNvbmRpdGlvbnMsIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL25nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvaXNzdWVzLzIxOTlcbiAgICBpZiAodGhpcy5fdW5yZWdpc3Rlckxpc3RlbmVyc0ZuKSB7XG4gICAgICB0aGlzLl91bnJlZ2lzdGVyTGlzdGVuZXJzRm4oKTtcbiAgICB9XG4gICAgdGhpcy5fem9uZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2hvdWxkQ2xvc2VGcm9tQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuYnV0dG9uICE9PSAyKSB7XG4gICAgICBpZiAodGhpcy5hdXRvQ2xvc2UgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuYXV0b0Nsb3NlID09PSAnaW5zaWRlJyAmJiB0aGlzLl9pc0V2ZW50RnJvbVRvb2x0aXAoZXZlbnQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmF1dG9DbG9zZSA9PT0gJ291dHNpZGUnICYmICF0aGlzLl9pc0V2ZW50RnJvbVRvb2x0aXAoZXZlbnQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9pc0V2ZW50RnJvbVRvb2x0aXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBjb25zdCBwb3B1cCA9IHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZTtcbiAgICByZXR1cm4gcG9wdXAgPyBwb3B1cC5pc0V2ZW50RnJvbShldmVudCkgOiBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHtOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7TmdiVG9vbHRpcCwgTmdiVG9vbHRpcFdpbmRvd30gZnJvbSAnLi90b29sdGlwJztcblxuZXhwb3J0IHtOZ2JUb29sdGlwQ29uZmlnfSBmcm9tICcuL3Rvb2x0aXAtY29uZmlnJztcbmV4cG9ydCB7TmdiVG9vbHRpcH0gZnJvbSAnLi90b29sdGlwJztcbmV4cG9ydCB7UGxhY2VtZW50fSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcblxuQE5nTW9kdWxlKHtkZWNsYXJhdGlvbnM6IFtOZ2JUb29sdGlwLCBOZ2JUb29sdGlwV2luZG93XSwgZXhwb3J0czogW05nYlRvb2x0aXBdLCBlbnRyeUNvbXBvbmVudHM6IFtOZ2JUb29sdGlwV2luZG93XX0pXG5leHBvcnQgY2xhc3MgTmdiVG9vbHRpcE1vZHVsZSB7XG4gIC8qKlxuICAgKiBObyBuZWVkIGluIGZvclJvb3QgYW55bW9yZSB3aXRoIHRyZWUtc2hha2VhYmxlIHNlcnZpY2VzXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiVG9vbHRpcE1vZHVsZX07IH1cbn1cbiIsImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgU2ltcGxlQ2hhbmdlcywgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtyZWdFeHBFc2NhcGUsIHRvU3RyaW5nfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG4vKipcbiAqIEEgY29tcG9uZW50IHRoYXQgY2FuIGJlIHVzZWQgaW5zaWRlIGEgY3VzdG9tIHJlc3VsdCB0ZW1wbGF0ZSBpbiBvcmRlciB0byBoaWdobGlnaHQgdGhlIHRlcm0gaW5zaWRlIHRoZSB0ZXh0IG9mIHRoZVxuICogcmVzdWx0XG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1oaWdobGlnaHQnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgdGVtcGxhdGU6IGA8bmctdGVtcGxhdGUgbmdGb3IgW25nRm9yT2ZdPVwicGFydHNcIiBsZXQtcGFydCBsZXQtaXNPZGQ9XCJvZGRcIj5gICtcbiAgICAgIGA8c3BhbiAqbmdJZj1cImlzT2RkOyBlbHNlIGV2ZW5cIiBbY2xhc3NdPVwiaGlnaGxpZ2h0Q2xhc3NcIj57e3BhcnR9fTwvc3Bhbj48bmctdGVtcGxhdGUgI2V2ZW4+e3twYXJ0fX08L25nLXRlbXBsYXRlPmAgK1xuICAgICAgYDwvbmctdGVtcGxhdGU+YCwgIC8vIHRlbXBsYXRlIG5lZWRzIHRvIGJlIGZvcm1hdHRlZCBpbiBhIGNlcnRhaW4gd2F5IHNvIHdlIGRvbid0IGFkZCBlbXB0eSB0ZXh0IG5vZGVzXG4gIHN0eWxlVXJsczogWycuL2hpZ2hsaWdodC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmdiSGlnaGxpZ2h0IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgcGFydHM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgQ1NTIGNsYXNzIG9mIHRoZSBzcGFuIGVsZW1lbnRzIHdyYXBwaW5nIHRoZSB0ZXJtIGluc2lkZSB0aGUgcmVzdWx0XG4gICAqL1xuICBASW5wdXQoKSBoaWdobGlnaHRDbGFzcyA9ICduZ2ItaGlnaGxpZ2h0JztcblxuICAvKipcbiAgICogVGhlIHJlc3VsdCB0ZXh0IHRvIGRpc3BsYXkuIElmIHRoZSB0ZXJtIGlzIGZvdW5kIGluc2lkZSB0aGlzIHRleHQsIGl0J3MgaGlnaGxpZ2h0ZWRcbiAgICovXG4gIEBJbnB1dCgpIHJlc3VsdDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgc2VhcmNoZWQgdGVybVxuICAgKi9cbiAgQElucHV0KCkgdGVybTogc3RyaW5nO1xuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCByZXN1bHRTdHIgPSB0b1N0cmluZyh0aGlzLnJlc3VsdCk7XG4gICAgY29uc3QgcmVzdWx0TEMgPSByZXN1bHRTdHIudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCB0ZXJtTEMgPSB0b1N0cmluZyh0aGlzLnRlcm0pLnRvTG93ZXJDYXNlKCk7XG4gICAgbGV0IGN1cnJlbnRJZHggPSAwO1xuXG4gICAgaWYgKHRlcm1MQy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnBhcnRzID0gcmVzdWx0TEMuc3BsaXQobmV3IFJlZ0V4cChgKCR7cmVnRXhwRXNjYXBlKHRlcm1MQyl9KWApKS5tYXAoKHBhcnQpID0+IHtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxQYXJ0ID0gcmVzdWx0U3RyLnN1YnN0cihjdXJyZW50SWR4LCBwYXJ0Lmxlbmd0aCk7XG4gICAgICAgIGN1cnJlbnRJZHggKz0gcGFydC5sZW5ndGg7XG4gICAgICAgIHJldHVybiBvcmlnaW5hbFBhcnQ7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJ0cyA9IFtyZXN1bHRTdHJdO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVGVtcGxhdGVSZWYsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7dG9TdHJpbmd9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbi8qKlxuICogQ29udGV4dCBmb3IgdGhlIHR5cGVhaGVhZCByZXN1bHQgdGVtcGxhdGUgaW4gY2FzZSB5b3Ugd2FudCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvbmVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXN1bHRUZW1wbGF0ZUNvbnRleHQge1xuICAvKipcbiAgICogWW91ciB0eXBlYWhlYWQgcmVzdWx0IGRhdGEgbW9kZWxcbiAgICovXG4gIHJlc3VsdDogYW55O1xuXG4gIC8qKlxuICAgKiBTZWFyY2ggdGVybSBmcm9tIHRoZSBpbnB1dCB1c2VkIHRvIGdldCBjdXJyZW50IHJlc3VsdFxuICAgKi9cbiAgdGVybTogc3RyaW5nO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItdHlwZWFoZWFkLXdpbmRvdycsXG4gIGV4cG9ydEFzOiAnbmdiVHlwZWFoZWFkV2luZG93JyxcbiAgaG9zdDogeydjbGFzcyc6ICdkcm9wZG93bi1tZW51IHNob3cnLCAncm9sZSc6ICdsaXN0Ym94JywgJ1tpZF0nOiAnaWQnfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGUgI3J0IGxldC1yZXN1bHQ9XCJyZXN1bHRcIiBsZXQtdGVybT1cInRlcm1cIiBsZXQtZm9ybWF0dGVyPVwiZm9ybWF0dGVyXCI+XG4gICAgICA8bmdiLWhpZ2hsaWdodCBbcmVzdWx0XT1cImZvcm1hdHRlcihyZXN1bHQpXCIgW3Rlcm1dPVwidGVybVwiPjwvbmdiLWhpZ2hsaWdodD5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBbbmdGb3JPZl09XCJyZXN1bHRzXCIgbGV0LXJlc3VsdCBsZXQtaWR4PVwiaW5kZXhcIj5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiIHJvbGU9XCJvcHRpb25cIlxuICAgICAgICBbaWRdPVwiaWQgKyAnLScgKyBpZHhcIlxuICAgICAgICBbY2xhc3MuYWN0aXZlXT1cImlkeCA9PT0gYWN0aXZlSWR4XCJcbiAgICAgICAgKG1vdXNlZW50ZXIpPVwibWFya0FjdGl2ZShpZHgpXCJcbiAgICAgICAgKGNsaWNrKT1cInNlbGVjdChyZXN1bHQpXCI+XG4gICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInJlc3VsdFRlbXBsYXRlIHx8IHJ0XCJcbiAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie3Jlc3VsdDogcmVzdWx0LCB0ZXJtOiB0ZXJtLCBmb3JtYXR0ZXI6IGZvcm1hdHRlcn1cIj48L25nLXRlbXBsYXRlPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JUeXBlYWhlYWRXaW5kb3cgaW1wbGVtZW50cyBPbkluaXQge1xuICBhY3RpdmVJZHggPSAwO1xuXG4gIC8qKlxuICAgKiAgVGhlIGlkIGZvciB0aGUgdHlwZWFoZWFkIHdpbmRvdy4gVGhlIGlkIHNob3VsZCBiZSB1bmlxdWUgYW5kIHRoZSBzYW1lXG4gICAqICBhcyB0aGUgYXNzb2NpYXRlZCB0eXBlYWhlYWQncyBpZC5cbiAgICovXG4gIEBJbnB1dCgpIGlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEZsYWcgaW5kaWNhdGluZyBpZiB0aGUgZmlyc3Qgcm93IHNob3VsZCBiZSBhY3RpdmUgaW5pdGlhbGx5XG4gICAqL1xuICBASW5wdXQoKSBmb2N1c0ZpcnN0ID0gdHJ1ZTtcblxuICAvKipcbiAgICogVHlwZWFoZWFkIG1hdGNoIHJlc3VsdHMgdG8gYmUgZGlzcGxheWVkXG4gICAqL1xuICBASW5wdXQoKSByZXN1bHRzO1xuXG4gIC8qKlxuICAgKiBTZWFyY2ggdGVybSB1c2VkIHRvIGdldCBjdXJyZW50IHJlc3VsdHNcbiAgICovXG4gIEBJbnB1dCgpIHRlcm06IHN0cmluZztcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB1c2VkIHRvIGZvcm1hdCBhIGdpdmVuIHJlc3VsdCBiZWZvcmUgZGlzcGxheS4gVGhpcyBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIGEgZm9ybWF0dGVkIHN0cmluZyB3aXRob3V0IGFueVxuICAgKiBIVE1MIG1hcmt1cFxuICAgKi9cbiAgQElucHV0KCkgZm9ybWF0dGVyID0gdG9TdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgdGVtcGxhdGUgdG8gb3ZlcnJpZGUgYSBtYXRjaGluZyByZXN1bHQgZGVmYXVsdCBkaXNwbGF5XG4gICAqL1xuICBASW5wdXQoKSByZXN1bHRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8UmVzdWx0VGVtcGxhdGVDb250ZXh0PjtcblxuICAvKipcbiAgICogRXZlbnQgcmFpc2VkIHdoZW4gdXNlciBzZWxlY3RzIGEgcGFydGljdWxhciByZXN1bHQgcm93XG4gICAqL1xuICBAT3V0cHV0KCdzZWxlY3QnKSBzZWxlY3RFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBAT3V0cHV0KCdhY3RpdmVDaGFuZ2UnKSBhY3RpdmVDaGFuZ2VFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBoYXNBY3RpdmUoKSB7IHJldHVybiB0aGlzLmFjdGl2ZUlkeCA+IC0xICYmIHRoaXMuYWN0aXZlSWR4IDwgdGhpcy5yZXN1bHRzLmxlbmd0aDsgfVxuXG4gIGdldEFjdGl2ZSgpIHsgcmV0dXJuIHRoaXMucmVzdWx0c1t0aGlzLmFjdGl2ZUlkeF07IH1cblxuICBtYXJrQWN0aXZlKGFjdGl2ZUlkeDogbnVtYmVyKSB7XG4gICAgdGhpcy5hY3RpdmVJZHggPSBhY3RpdmVJZHg7XG4gICAgdGhpcy5fYWN0aXZlQ2hhbmdlZCgpO1xuICB9XG5cbiAgbmV4dCgpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVJZHggPT09IHRoaXMucmVzdWx0cy5sZW5ndGggLSAxKSB7XG4gICAgICB0aGlzLmFjdGl2ZUlkeCA9IHRoaXMuZm9jdXNGaXJzdCA/ICh0aGlzLmFjdGl2ZUlkeCArIDEpICUgdGhpcy5yZXN1bHRzLmxlbmd0aCA6IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjdGl2ZUlkeCsrO1xuICAgIH1cbiAgICB0aGlzLl9hY3RpdmVDaGFuZ2VkKCk7XG4gIH1cblxuICBwcmV2KCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZUlkeCA8IDApIHtcbiAgICAgIHRoaXMuYWN0aXZlSWR4ID0gdGhpcy5yZXN1bHRzLmxlbmd0aCAtIDE7XG4gICAgfSBlbHNlIGlmICh0aGlzLmFjdGl2ZUlkeCA9PT0gMCkge1xuICAgICAgdGhpcy5hY3RpdmVJZHggPSB0aGlzLmZvY3VzRmlyc3QgPyB0aGlzLnJlc3VsdHMubGVuZ3RoIC0gMSA6IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjdGl2ZUlkeC0tO1xuICAgIH1cbiAgICB0aGlzLl9hY3RpdmVDaGFuZ2VkKCk7XG4gIH1cblxuICByZXNldEFjdGl2ZSgpIHtcbiAgICB0aGlzLmFjdGl2ZUlkeCA9IHRoaXMuZm9jdXNGaXJzdCA/IDAgOiAtMTtcbiAgICB0aGlzLl9hY3RpdmVDaGFuZ2VkKCk7XG4gIH1cblxuICBzZWxlY3QoaXRlbSkgeyB0aGlzLnNlbGVjdEV2ZW50LmVtaXQoaXRlbSk7IH1cblxuICBuZ09uSW5pdCgpIHsgdGhpcy5yZXNldEFjdGl2ZSgpOyB9XG5cbiAgcHJpdmF0ZSBfYWN0aXZlQ2hhbmdlZCgpIHtcbiAgICB0aGlzLmFjdGl2ZUNoYW5nZUV2ZW50LmVtaXQodGhpcy5hY3RpdmVJZHggPj0gMCA/IHRoaXMuaWQgKyAnLScgKyB0aGlzLmFjdGl2ZUlkeCA6IHVuZGVmaW5lZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZSwgSW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgT25EZXN0cm95fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cblxuXG4vLyB1c2VmdWxuZXNzIChhbmQgZGVmYXVsdCB2YWx1ZSkgb2YgZGVsYXkgZG9jdW1lbnRlZCBpbiBNYXRlcmlhbCdzIENES1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvbWF0ZXJpYWwyL2Jsb2IvNjQwNWRhOWI4ZTg1MzJhN2U1Yzg1NGM5MjBlZTE4MTVjMjc1ZDczNC9zcmMvY2RrL2ExMXkvbGl2ZS1hbm5vdW5jZXIvbGl2ZS1hbm5vdW5jZXIudHMjTDUwXG5leHBvcnQgdHlwZSBBUklBX0xJVkVfREVMQVlfVFlQRSA9IG51bWJlciB8IG51bGw7XG5leHBvcnQgY29uc3QgQVJJQV9MSVZFX0RFTEFZID0gbmV3IEluamVjdGlvblRva2VuPEFSSUFfTElWRV9ERUxBWV9UWVBFPihcbiAgICAnbGl2ZSBhbm5vdW5jZXIgZGVsYXknLCB7cHJvdmlkZWRJbjogJ3Jvb3QnLCBmYWN0b3J5OiBBUklBX0xJVkVfREVMQVlfRkFDVE9SWX0pO1xuZXhwb3J0IGZ1bmN0aW9uIEFSSUFfTElWRV9ERUxBWV9GQUNUT1JZKCk6IG51bWJlciB7XG4gIHJldHVybiAxMDA7XG59XG5cblxuZnVuY3Rpb24gZ2V0TGl2ZUVsZW1lbnQoZG9jdW1lbnQ6IGFueSwgbGF6eUNyZWF0ZSA9IGZhbHNlKTogSFRNTEVsZW1lbnQgfCBudWxsIHtcbiAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJyNuZ2ItbGl2ZScpIGFzIEhUTUxFbGVtZW50O1xuXG4gIGlmIChlbGVtZW50ID09IG51bGwgJiYgbGF6eUNyZWF0ZSkge1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsICduZ2ItbGl2ZScpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAncG9saXRlJyk7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtYXRvbWljJywgJ3RydWUnKTtcblxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc3Itb25seScpO1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5cblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksIEBJbmplY3QoQVJJQV9MSVZFX0RFTEFZKSBwcml2YXRlIF9kZWxheTogYW55KSB7fVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBnZXRMaXZlRWxlbWVudCh0aGlzLl9kb2N1bWVudCk7XG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBzYXkobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGdldExpdmVFbGVtZW50KHRoaXMuX2RvY3VtZW50LCB0cnVlKTtcbiAgICBjb25zdCBkZWxheSA9IHRoaXMuX2RlbGF5O1xuXG4gICAgZWxlbWVudC50ZXh0Q29udGVudCA9ICcnO1xuICAgIGNvbnN0IHNldFRleHQgPSAoKSA9PiBlbGVtZW50LnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICBpZiAoZGVsYXkgPT09IG51bGwpIHtcbiAgICAgIHNldFRleHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VGltZW91dChzZXRUZXh0LCBkZWxheSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbGFjZW1lbnRBcnJheX0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBzZXJ2aWNlIGZvciB0aGUgTmdiVHlwZWFoZWFkIGNvbXBvbmVudC5cbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSB0eXBlYWhlYWRzIHVzZWQgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JUeXBlYWhlYWRDb25maWcge1xuICBjb250YWluZXI7XG4gIGVkaXRhYmxlID0gdHJ1ZTtcbiAgZm9jdXNGaXJzdCA9IHRydWU7XG4gIHNob3dIaW50ID0gZmFsc2U7XG4gIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXkgPSAnYm90dG9tLWxlZnQnO1xufVxuIiwiaW1wb3J0IHtcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBDb21wb25lbnRSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge09ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCwgU3Vic2NyaXB0aW9uLCBmcm9tRXZlbnR9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtwb3NpdGlvbkVsZW1lbnRzLCBQbGFjZW1lbnRBcnJheX0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5pbXBvcnQge05nYlR5cGVhaGVhZFdpbmRvdywgUmVzdWx0VGVtcGxhdGVDb250ZXh0fSBmcm9tICcuL3R5cGVhaGVhZC13aW5kb3cnO1xuaW1wb3J0IHtQb3B1cFNlcnZpY2V9IGZyb20gJy4uL3V0aWwvcG9wdXAnO1xuaW1wb3J0IHt0b1N0cmluZywgaXNEZWZpbmVkfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtLZXl9IGZyb20gJy4uL3V0aWwva2V5JztcbmltcG9ydCB7TGl2ZX0gZnJvbSAnLi4vdXRpbC9hY2Nlc3NpYmlsaXR5L2xpdmUnO1xuaW1wb3J0IHtOZ2JUeXBlYWhlYWRDb25maWd9IGZyb20gJy4vdHlwZWFoZWFkLWNvbmZpZyc7XG5pbXBvcnQge21hcCwgc3dpdGNoTWFwLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuY29uc3QgTkdCX1RZUEVBSEVBRF9WQUxVRV9BQ0NFU1NPUiA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYlR5cGVhaGVhZCksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIFBheWxvYWQgb2YgdGhlIHNlbGVjdEl0ZW0gZXZlbnQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiVHlwZWFoZWFkU2VsZWN0SXRlbUV2ZW50IHtcbiAgLyoqXG4gICAqIEFuIGl0ZW0gYWJvdXQgdG8gYmUgc2VsZWN0ZWRcbiAgICovXG4gIGl0ZW06IGFueTtcblxuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCB3aWxsIHByZXZlbnQgaXRlbSBzZWxlY3Rpb24gaWYgY2FsbGVkXG4gICAqL1xuICBwcmV2ZW50RGVmYXVsdDogKCkgPT4gdm9pZDtcbn1cblxubGV0IG5leHRXaW5kb3dJZCA9IDA7XG5cbi8qKlxuICogTmdiVHlwZWFoZWFkIGRpcmVjdGl2ZSBwcm92aWRlcyBhIHNpbXBsZSB3YXkgb2YgY3JlYXRpbmcgcG93ZXJmdWwgdHlwZWFoZWFkcyBmcm9tIGFueSB0ZXh0IGlucHV0XG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W25nYlR5cGVhaGVhZF0nLFxuICBleHBvcnRBczogJ25nYlR5cGVhaGVhZCcsXG4gIGhvc3Q6IHtcbiAgICAnKGJsdXIpJzogJ2hhbmRsZUJsdXIoKScsXG4gICAgJ1tjbGFzcy5vcGVuXSc6ICdpc1BvcHVwT3BlbigpJyxcbiAgICAnKGRvY3VtZW50OmNsaWNrKSc6ICdvbkRvY3VtZW50Q2xpY2soJGV2ZW50KScsXG4gICAgJyhrZXlkb3duKSc6ICdoYW5kbGVLZXlEb3duKCRldmVudCknLFxuICAgICdbYXV0b2NvbXBsZXRlXSc6ICdhdXRvY29tcGxldGUnLFxuICAgICdhdXRvY2FwaXRhbGl6ZSc6ICdvZmYnLFxuICAgICdhdXRvY29ycmVjdCc6ICdvZmYnLFxuICAgICdyb2xlJzogJ2NvbWJvYm94JyxcbiAgICAnYXJpYS1tdWx0aWxpbmUnOiAnZmFsc2UnLFxuICAgICdbYXR0ci5hcmlhLWF1dG9jb21wbGV0ZV0nOiAnc2hvd0hpbnQgPyBcImJvdGhcIiA6IFwibGlzdFwiJyxcbiAgICAnW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XSc6ICdhY3RpdmVEZXNjZW5kYW50JyxcbiAgICAnW2F0dHIuYXJpYS1vd25zXSc6ICdpc1BvcHVwT3BlbigpID8gcG9wdXBJZCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdpc1BvcHVwT3BlbigpJ1xuICB9LFxuICBwcm92aWRlcnM6IFtOR0JfVFlQRUFIRUFEX1ZBTFVFX0FDQ0VTU09SXVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JUeXBlYWhlYWQgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX3BvcHVwU2VydmljZTogUG9wdXBTZXJ2aWNlPE5nYlR5cGVhaGVhZFdpbmRvdz47XG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIF9pbnB1dFZhbHVlQmFja3VwOiBzdHJpbmc7XG4gIHByaXZhdGUgX3ZhbHVlQ2hhbmdlczogT2JzZXJ2YWJsZTxzdHJpbmc+O1xuICBwcml2YXRlIF9yZXN1YnNjcmliZVR5cGVhaGVhZDogQmVoYXZpb3JTdWJqZWN0PGFueT47XG4gIHByaXZhdGUgX3dpbmRvd1JlZjogQ29tcG9uZW50UmVmPE5nYlR5cGVhaGVhZFdpbmRvdz47XG4gIHByaXZhdGUgX3pvbmVTdWJzY3JpcHRpb246IGFueTtcblxuICAvKipcbiAgICogVmFsdWUgZm9yIHRoZSBjb25maWd1cmFibGUgYXV0b2NvbXBsZXRlIGF0dHJpYnV0ZS5cbiAgICogRGVmYXVsdHMgdG8gJ29mZicgdG8gZGlzYWJsZSB0aGUgbmF0aXZlIGJyb3dzZXIgYXV0b2NvbXBsZXRlLCBidXQgdGhpcyBzdGFuZGFyZCB2YWx1ZSBkb2VzIG5vdCBzZWVtXG4gICAqIHRvIGJlIGFsd2F5cyBjb3JyZWN0bHkgdGFrZW4gaW50byBhY2NvdW50LlxuICAgKlxuICAgKiBAc2luY2UgMi4xLjBcbiAgICovXG4gIEBJbnB1dCgpIGF1dG9jb21wbGV0ZSA9ICdvZmYnO1xuXG4gIC8qKlxuICAgKiBBIHNlbGVjdG9yIHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIHRvb2x0aXAgc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgKiBDdXJyZW50bHkgb25seSBzdXBwb3J0cyBcImJvZHlcIi5cbiAgICovXG4gIEBJbnB1dCgpIGNvbnRhaW5lcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgaW5kaWNhdGluZyBpZiBtb2RlbCB2YWx1ZXMgc2hvdWxkIGJlIHJlc3RyaWN0ZWQgdG8gdGhlIG9uZXMgc2VsZWN0ZWQgZnJvbSB0aGUgcG9wdXAgb25seS5cbiAgICovXG4gIEBJbnB1dCgpIGVkaXRhYmxlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgaW5kaWNhdGluZyBpZiB0aGUgZmlyc3QgbWF0Y2ggc2hvdWxkIGF1dG9tYXRpY2FsbHkgYmUgZm9jdXNlZCBhcyB5b3UgdHlwZS5cbiAgICovXG4gIEBJbnB1dCgpIGZvY3VzRmlyc3Q6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdG8gY29udmVydCBhIGdpdmVuIHZhbHVlIGludG8gc3RyaW5nIHRvIGRpc3BsYXkgaW4gdGhlIGlucHV0IGZpZWxkXG4gICAqL1xuICBASW5wdXQoKSBpbnB1dEZvcm1hdHRlcjogKHZhbHVlOiBhbnkpID0+IHN0cmluZztcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB0byB0cmFuc2Zvcm0gdGhlIHByb3ZpZGVkIG9ic2VydmFibGUgdGV4dCBpbnRvIHRoZSBhcnJheSBvZiByZXN1bHRzLiAgTm90ZSB0aGF0IHRoZSBcInRoaXNcIiBhcmd1bWVudFxuICAgKiBpcyB1bmRlZmluZWQgc28geW91IG5lZWQgdG8gZXhwbGljaXRseSBiaW5kIGl0IHRvIGEgZGVzaXJlZCBcInRoaXNcIiB0YXJnZXQuXG4gICAqL1xuICBASW5wdXQoKSBuZ2JUeXBlYWhlYWQ6ICh0ZXh0OiBPYnNlcnZhYmxlPHN0cmluZz4pID0+IE9ic2VydmFibGU8YW55W10+O1xuXG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHRvIGZvcm1hdCBhIGdpdmVuIHJlc3VsdCBiZWZvcmUgZGlzcGxheS4gVGhpcyBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIGEgZm9ybWF0dGVkIHN0cmluZyB3aXRob3V0IGFueVxuICAgKiBIVE1MIG1hcmt1cFxuICAgKi9cbiAgQElucHV0KCkgcmVzdWx0Rm9ybWF0dGVyOiAodmFsdWU6IGFueSkgPT4gc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHRlbXBsYXRlIHRvIG92ZXJyaWRlIGEgbWF0Y2hpbmcgcmVzdWx0IGRlZmF1bHQgZGlzcGxheVxuICAgKi9cbiAgQElucHV0KCkgcmVzdWx0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPFJlc3VsdFRlbXBsYXRlQ29udGV4dD47XG5cbiAgLyoqXG4gICAqIFNob3cgaGludCB3aGVuIGFuIG9wdGlvbiBpbiB0aGUgcmVzdWx0IGxpc3QgbWF0Y2hlcy5cbiAgICovXG4gIEBJbnB1dCgpIHNob3dIaW50OiBib29sZWFuO1xuXG4gIC8qKiBQbGFjZW1lbnQgb2YgYSB0eXBlYWhlYWQgYWNjZXB0czpcbiAgICogICAgXCJ0b3BcIiwgXCJ0b3AtbGVmdFwiLCBcInRvcC1yaWdodFwiLCBcImJvdHRvbVwiLCBcImJvdHRvbS1sZWZ0XCIsIFwiYm90dG9tLXJpZ2h0XCIsXG4gICAqICAgIFwibGVmdFwiLCBcImxlZnQtdG9wXCIsIFwibGVmdC1ib3R0b21cIiwgXCJyaWdodFwiLCBcInJpZ2h0LXRvcFwiLCBcInJpZ2h0LWJvdHRvbVwiXG4gICAqIGFuZCBhcnJheSBvZiBhYm92ZSB2YWx1ZXMuXG4gICovXG4gIEBJbnB1dCgpIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXkgPSAnYm90dG9tLWxlZnQnO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gYSBtYXRjaCBpcyBzZWxlY3RlZC4gRXZlbnQgcGF5bG9hZCBpcyBvZiB0eXBlIE5nYlR5cGVhaGVhZFNlbGVjdEl0ZW1FdmVudC5cbiAgICovXG4gIEBPdXRwdXQoKSBzZWxlY3RJdGVtID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JUeXBlYWhlYWRTZWxlY3RJdGVtRXZlbnQ+KCk7XG5cbiAgYWN0aXZlRGVzY2VuZGFudDogc3RyaW5nO1xuICBwb3B1cElkID0gYG5nYi10eXBlYWhlYWQtJHtuZXh0V2luZG93SWQrK31gO1xuXG4gIHByaXZhdGUgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuICBwcml2YXRlIF9vbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PiwgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvciwgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICBjb25maWc6IE5nYlR5cGVhaGVhZENvbmZpZywgbmdab25lOiBOZ1pvbmUsIHByaXZhdGUgX2xpdmU6IExpdmUpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbmZpZy5jb250YWluZXI7XG4gICAgdGhpcy5lZGl0YWJsZSA9IGNvbmZpZy5lZGl0YWJsZTtcbiAgICB0aGlzLmZvY3VzRmlyc3QgPSBjb25maWcuZm9jdXNGaXJzdDtcbiAgICB0aGlzLnNob3dIaW50ID0gY29uZmlnLnNob3dIaW50O1xuICAgIHRoaXMucGxhY2VtZW50ID0gY29uZmlnLnBsYWNlbWVudDtcblxuICAgIHRoaXMuX3ZhbHVlQ2hhbmdlcyA9IGZyb21FdmVudDxFdmVudD4oX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2lucHV0JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUobWFwKCRldmVudCA9PiAoJGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSkpO1xuXG4gICAgdGhpcy5fcmVzdWJzY3JpYmVUeXBlYWhlYWQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KG51bGwpO1xuXG4gICAgdGhpcy5fcG9wdXBTZXJ2aWNlID0gbmV3IFBvcHVwU2VydmljZTxOZ2JUeXBlYWhlYWRXaW5kb3c+KFxuICAgICAgICBOZ2JUeXBlYWhlYWRXaW5kb3csIF9pbmplY3RvciwgX3ZpZXdDb250YWluZXJSZWYsIF9yZW5kZXJlciwgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyKTtcblxuICAgIHRoaXMuX3pvbmVTdWJzY3JpcHRpb24gPSBuZ1pvbmUub25TdGFibGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzUG9wdXBPcGVuKCkpIHtcbiAgICAgICAgcG9zaXRpb25FbGVtZW50cyhcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsIHRoaXMucGxhY2VtZW50LFxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPT09ICdib2R5Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBjb25zdCBpbnB1dFZhbHVlcyQgPSB0aGlzLl92YWx1ZUNoYW5nZXMucGlwZSh0YXAodmFsdWUgPT4ge1xuICAgICAgdGhpcy5faW5wdXRWYWx1ZUJhY2t1cCA9IHZhbHVlO1xuICAgICAgaWYgKHRoaXMuZWRpdGFibGUpIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UodmFsdWUpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgICBjb25zdCByZXN1bHRzJCA9IGlucHV0VmFsdWVzJC5waXBlKHRoaXMubmdiVHlwZWFoZWFkKTtcbiAgICBjb25zdCBwcm9jZXNzZWRSZXN1bHRzJCA9IHJlc3VsdHMkLnBpcGUodGFwKCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5lZGl0YWJsZSkge1xuICAgICAgICB0aGlzLl9vbkNoYW5nZSh1bmRlZmluZWQpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgICBjb25zdCB1c2VySW5wdXQkID0gdGhpcy5fcmVzdWJzY3JpYmVUeXBlYWhlYWQucGlwZShzd2l0Y2hNYXAoKCkgPT4gcHJvY2Vzc2VkUmVzdWx0cyQpKTtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb24gPSB0aGlzLl9zdWJzY3JpYmVUb1VzZXJJbnB1dCh1c2VySW5wdXQkKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX2Nsb3NlUG9wdXAoKTtcbiAgICB0aGlzLl91bnN1YnNjcmliZUZyb21Vc2VySW5wdXQoKTtcbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gYW55KTogdm9pZCB7IHRoaXMuX29uQ2hhbmdlID0gZm47IH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gYW55KTogdm9pZCB7IHRoaXMuX29uVG91Y2hlZCA9IGZuOyB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZSkgeyB0aGlzLl93cml0ZUlucHV0VmFsdWUodGhpcy5fZm9ybWF0SXRlbUZvcklucHV0KHZhbHVlKSk7IH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpO1xuICB9XG5cbiAgb25Eb2N1bWVudENsaWNrKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldCAhPT0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSB7XG4gICAgICB0aGlzLmRpc21pc3NQb3B1cCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdHlwZWFoZWFkIHBvcHVwIHdpbmRvd1xuICAgKi9cbiAgZGlzbWlzc1BvcHVwKCkge1xuICAgIGlmICh0aGlzLmlzUG9wdXBPcGVuKCkpIHtcbiAgICAgIHRoaXMuX2Nsb3NlUG9wdXAoKTtcbiAgICAgIHRoaXMuX3dyaXRlSW5wdXRWYWx1ZSh0aGlzLl9pbnB1dFZhbHVlQmFja3VwKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB0eXBlYWhlYWQgcG9wdXAgd2luZG93IGlzIGRpc3BsYXllZFxuICAgKi9cbiAgaXNQb3B1cE9wZW4oKSB7IHJldHVybiB0aGlzLl93aW5kb3dSZWYgIT0gbnVsbDsgfVxuXG4gIGhhbmRsZUJsdXIoKSB7XG4gICAgdGhpcy5fcmVzdWJzY3JpYmVUeXBlYWhlYWQubmV4dChudWxsKTtcbiAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgfVxuXG4gIGhhbmRsZUtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuaXNQb3B1cE9wZW4oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkZXByZWNhdGlvblxuICAgIGNvbnN0IHt3aGljaH0gPSBldmVudDtcbiAgICBpZiAoS2V5W3RvU3RyaW5nKHdoaWNoKV0pIHtcbiAgICAgIHN3aXRjaCAod2hpY2gpIHtcbiAgICAgICAgY2FzZSBLZXkuQXJyb3dEb3duOlxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLm5leHQoKTtcbiAgICAgICAgICB0aGlzLl9zaG93SGludCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5BcnJvd1VwOlxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLnByZXYoKTtcbiAgICAgICAgICB0aGlzLl9zaG93SGludCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5FbnRlcjpcbiAgICAgICAgY2FzZSBLZXkuVGFiOlxuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5nZXRBY3RpdmUoKTtcbiAgICAgICAgICBpZiAoaXNEZWZpbmVkKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdFJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9jbG9zZVBvcHVwKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5LkVzY2FwZTpcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuX3Jlc3Vic2NyaWJlVHlwZWFoZWFkLm5leHQobnVsbCk7XG4gICAgICAgICAgdGhpcy5kaXNtaXNzUG9wdXAoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9vcGVuUG9wdXAoKSB7XG4gICAgaWYgKCF0aGlzLmlzUG9wdXBPcGVuKCkpIHtcbiAgICAgIHRoaXMuX2lucHV0VmFsdWVCYWNrdXAgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gICAgICB0aGlzLl93aW5kb3dSZWYgPSB0aGlzLl9wb3B1cFNlcnZpY2Uub3BlbigpO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmlkID0gdGhpcy5wb3B1cElkO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLnNlbGVjdEV2ZW50LnN1YnNjcmliZSgocmVzdWx0OiBhbnkpID0+IHRoaXMuX3NlbGVjdFJlc3VsdENsb3NlUG9wdXAocmVzdWx0KSk7XG4gICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuYWN0aXZlQ2hhbmdlRXZlbnQuc3Vic2NyaWJlKChhY3RpdmVJZDogc3RyaW5nKSA9PiB0aGlzLmFjdGl2ZURlc2NlbmRhbnQgPSBhY3RpdmVJZCk7XG5cbiAgICAgIGlmICh0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKSB7XG4gICAgICAgIHdpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuY29udGFpbmVyKS5hcHBlbmRDaGlsZCh0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2xvc2VQb3B1cCgpIHtcbiAgICB0aGlzLl9wb3B1cFNlcnZpY2UuY2xvc2UoKTtcbiAgICB0aGlzLl93aW5kb3dSZWYgPSBudWxsO1xuICAgIHRoaXMuYWN0aXZlRGVzY2VuZGFudCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgX3NlbGVjdFJlc3VsdChyZXN1bHQ6IGFueSkge1xuICAgIGxldCBkZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XG4gICAgdGhpcy5zZWxlY3RJdGVtLmVtaXQoe2l0ZW06IHJlc3VsdCwgcHJldmVudERlZmF1bHQ6ICgpID0+IHsgZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7IH19KTtcbiAgICB0aGlzLl9yZXN1YnNjcmliZVR5cGVhaGVhZC5uZXh0KG51bGwpO1xuXG4gICAgaWYgKCFkZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICB0aGlzLndyaXRlVmFsdWUocmVzdWx0KTtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKHJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2VsZWN0UmVzdWx0Q2xvc2VQb3B1cChyZXN1bHQ6IGFueSkge1xuICAgIHRoaXMuX3NlbGVjdFJlc3VsdChyZXN1bHQpO1xuICAgIHRoaXMuX2Nsb3NlUG9wdXAoKTtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Nob3dIaW50KCkge1xuICAgIGlmICh0aGlzLnNob3dIaW50ICYmIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5oYXNBY3RpdmUoKSAmJiB0aGlzLl9pbnB1dFZhbHVlQmFja3VwICE9IG51bGwpIHtcbiAgICAgIGNvbnN0IHVzZXJJbnB1dExvd2VyQ2FzZSA9IHRoaXMuX2lucHV0VmFsdWVCYWNrdXAudG9Mb3dlckNhc2UoKTtcbiAgICAgIGNvbnN0IGZvcm1hdHRlZFZhbCA9IHRoaXMuX2Zvcm1hdEl0ZW1Gb3JJbnB1dCh0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuZ2V0QWN0aXZlKCkpO1xuXG4gICAgICBpZiAodXNlcklucHV0TG93ZXJDYXNlID09PSBmb3JtYXR0ZWRWYWwuc3Vic3RyKDAsIHRoaXMuX2lucHV0VmFsdWVCYWNrdXAubGVuZ3RoKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIHRoaXMuX3dyaXRlSW5wdXRWYWx1ZSh0aGlzLl9pbnB1dFZhbHVlQmFja3VwICsgZm9ybWF0dGVkVmFsLnN1YnN0cih0aGlzLl9pbnB1dFZhbHVlQmFja3VwLmxlbmd0aCkpO1xuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRbJ3NldFNlbGVjdGlvblJhbmdlJ10uYXBwbHkoXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIFt0aGlzLl9pbnB1dFZhbHVlQmFja3VwLmxlbmd0aCwgZm9ybWF0dGVkVmFsLmxlbmd0aF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy53cml0ZVZhbHVlKHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5nZXRBY3RpdmUoKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZm9ybWF0SXRlbUZvcklucHV0KGl0ZW06IGFueSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGl0ZW0gIT0gbnVsbCAmJiB0aGlzLmlucHV0Rm9ybWF0dGVyID8gdGhpcy5pbnB1dEZvcm1hdHRlcihpdGVtKSA6IHRvU3RyaW5nKGl0ZW0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd3JpdGVJbnB1dFZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHRvU3RyaW5nKHZhbHVlKSk7XG4gIH1cblxuICBwcml2YXRlIF9zdWJzY3JpYmVUb1VzZXJJbnB1dCh1c2VySW5wdXQkOiBPYnNlcnZhYmxlPGFueVtdPik6IFN1YnNjcmlwdGlvbiB7XG4gICAgcmV0dXJuIHVzZXJJbnB1dCQuc3Vic2NyaWJlKChyZXN1bHRzKSA9PiB7XG4gICAgICBpZiAoIXJlc3VsdHMgfHwgcmVzdWx0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fY2xvc2VQb3B1cCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fb3BlblBvcHVwKCk7XG4gICAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5mb2N1c0ZpcnN0ID0gdGhpcy5mb2N1c0ZpcnN0O1xuICAgICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UucmVzdWx0cyA9IHJlc3VsdHM7XG4gICAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS50ZXJtID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgICBpZiAodGhpcy5yZXN1bHRGb3JtYXR0ZXIpIHtcbiAgICAgICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuZm9ybWF0dGVyID0gdGhpcy5yZXN1bHRGb3JtYXR0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVzdWx0VGVtcGxhdGUpIHtcbiAgICAgICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UucmVzdWx0VGVtcGxhdGUgPSB0aGlzLnJlc3VsdFRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5yZXNldEFjdGl2ZSgpO1xuXG4gICAgICAgIC8vIFRoZSBvYnNlcnZhYmxlIHN0cmVhbSB3ZSBhcmUgc3Vic2NyaWJpbmcgdG8gbWlnaHQgaGF2ZSBhc3luYyBzdGVwc1xuICAgICAgICAvLyBhbmQgaWYgYSBjb21wb25lbnQgY29udGFpbmluZyB0eXBlYWhlYWQgaXMgdXNpbmcgdGhlIE9uUHVzaCBzdHJhdGVneVxuICAgICAgICAvLyB0aGUgY2hhbmdlIGRldGVjdGlvbiB0dXJuIHdvdWxkbid0IGJlIGludm9rZWQgYXV0b21hdGljYWxseS5cbiAgICAgICAgdGhpcy5fd2luZG93UmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcblxuICAgICAgICB0aGlzLl9zaG93SGludCgpO1xuICAgICAgfVxuXG4gICAgICAvLyBsaXZlIGFubm91bmNlclxuICAgICAgY29uc3QgY291bnQgPSByZXN1bHRzID8gcmVzdWx0cy5sZW5ndGggOiAwO1xuICAgICAgdGhpcy5fbGl2ZS5zYXkoY291bnQgPT09IDAgPyAnTm8gcmVzdWx0cyBhdmFpbGFibGUnIDogYCR7Y291bnR9IHJlc3VsdCR7Y291bnQgPT09IDEgPyAnJyA6ICdzJ30gYXZhaWxhYmxlYCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF91bnN1YnNjcmliZUZyb21Vc2VySW5wdXQoKSB7XG4gICAgaWYgKHRoaXMuX3N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7TmdiSGlnaGxpZ2h0fSBmcm9tICcuL2hpZ2hsaWdodCc7XG5pbXBvcnQge05nYlR5cGVhaGVhZFdpbmRvd30gZnJvbSAnLi90eXBlYWhlYWQtd2luZG93JztcbmltcG9ydCB7TmdiVHlwZWFoZWFkfSBmcm9tICcuL3R5cGVhaGVhZCc7XG5cbmV4cG9ydCB7TmdiSGlnaGxpZ2h0fSBmcm9tICcuL2hpZ2hsaWdodCc7XG5leHBvcnQge05nYlR5cGVhaGVhZFdpbmRvd30gZnJvbSAnLi90eXBlYWhlYWQtd2luZG93JztcbmV4cG9ydCB7TmdiVHlwZWFoZWFkQ29uZmlnfSBmcm9tICcuL3R5cGVhaGVhZC1jb25maWcnO1xuZXhwb3J0IHtOZ2JUeXBlYWhlYWQsIE5nYlR5cGVhaGVhZFNlbGVjdEl0ZW1FdmVudH0gZnJvbSAnLi90eXBlYWhlYWQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtOZ2JUeXBlYWhlYWQsIE5nYkhpZ2hsaWdodCwgTmdiVHlwZWFoZWFkV2luZG93XSxcbiAgZXhwb3J0czogW05nYlR5cGVhaGVhZCwgTmdiSGlnaGxpZ2h0XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGVudHJ5Q29tcG9uZW50czogW05nYlR5cGVhaGVhZFdpbmRvd11cbn0pXG5leHBvcnQgY2xhc3MgTmdiVHlwZWFoZWFkTW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYlR5cGVhaGVhZE1vZHVsZX07IH1cbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge05nYkFjY29yZGlvbk1vZHVsZSwgTmdiUGFuZWxDaGFuZ2VFdmVudH0gZnJvbSAnLi9hY2NvcmRpb24vYWNjb3JkaW9uLm1vZHVsZSc7XG5pbXBvcnQge05nYkFsZXJ0TW9kdWxlfSBmcm9tICcuL2FsZXJ0L2FsZXJ0Lm1vZHVsZSc7XG5pbXBvcnQge05nYkJ1dHRvbnNNb2R1bGV9IGZyb20gJy4vYnV0dG9ucy9idXR0b25zLm1vZHVsZSc7XG5pbXBvcnQge05nYkNhcm91c2VsTW9kdWxlfSBmcm9tICcuL2Nhcm91c2VsL2Nhcm91c2VsLm1vZHVsZSc7XG5pbXBvcnQge05nYkNvbGxhcHNlTW9kdWxlfSBmcm9tICcuL2NvbGxhcHNlL2NvbGxhcHNlLm1vZHVsZSc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJNb2R1bGV9IGZyb20gJy4vZGF0ZXBpY2tlci9kYXRlcGlja2VyLm1vZHVsZSc7XG5pbXBvcnQge05nYkRyb3Bkb3duTW9kdWxlfSBmcm9tICcuL2Ryb3Bkb3duL2Ryb3Bkb3duLm1vZHVsZSc7XG5pbXBvcnQge1xuICBOZ2JNb2RhbE1vZHVsZSxcbiAgTmdiTW9kYWwsXG4gIE5nYk1vZGFsQ29uZmlnLFxuICBOZ2JNb2RhbE9wdGlvbnMsXG4gIE5nYk1vZGFsUmVmLFxuICBNb2RhbERpc21pc3NSZWFzb25zXG59IGZyb20gJy4vbW9kYWwvbW9kYWwubW9kdWxlJztcbmltcG9ydCB7TmdiUGFnaW5hdGlvbk1vZHVsZX0gZnJvbSAnLi9wYWdpbmF0aW9uL3BhZ2luYXRpb24ubW9kdWxlJztcbmltcG9ydCB7TmdiUG9wb3Zlck1vZHVsZX0gZnJvbSAnLi9wb3BvdmVyL3BvcG92ZXIubW9kdWxlJztcbmltcG9ydCB7TmdiUHJvZ3Jlc3NiYXJNb2R1bGV9IGZyb20gJy4vcHJvZ3Jlc3NiYXIvcHJvZ3Jlc3NiYXIubW9kdWxlJztcbmltcG9ydCB7TmdiUmF0aW5nTW9kdWxlfSBmcm9tICcuL3JhdGluZy9yYXRpbmcubW9kdWxlJztcbmltcG9ydCB7TmdiVGFic2V0TW9kdWxlLCBOZ2JUYWJDaGFuZ2VFdmVudH0gZnJvbSAnLi90YWJzZXQvdGFic2V0Lm1vZHVsZSc7XG5pbXBvcnQge05nYlRpbWVwaWNrZXJNb2R1bGV9IGZyb20gJy4vdGltZXBpY2tlci90aW1lcGlja2VyLm1vZHVsZSc7XG5pbXBvcnQge05nYlRvb2x0aXBNb2R1bGV9IGZyb20gJy4vdG9vbHRpcC90b29sdGlwLm1vZHVsZSc7XG5pbXBvcnQge05nYlR5cGVhaGVhZE1vZHVsZSwgTmdiVHlwZWFoZWFkU2VsZWN0SXRlbUV2ZW50fSBmcm9tICcuL3R5cGVhaGVhZC90eXBlYWhlYWQubW9kdWxlJztcblxuZXhwb3J0IHtcbiAgTmdiQWNjb3JkaW9uTW9kdWxlLFxuICBOZ2JQYW5lbENoYW5nZUV2ZW50LFxuICBOZ2JBY2NvcmRpb25Db25maWcsXG4gIE5nYkFjY29yZGlvbixcbiAgTmdiUGFuZWwsXG4gIE5nYlBhbmVsVGl0bGUsXG4gIE5nYlBhbmVsQ29udGVudFxufSBmcm9tICcuL2FjY29yZGlvbi9hY2NvcmRpb24ubW9kdWxlJztcbmV4cG9ydCB7TmdiQWxlcnRNb2R1bGUsIE5nYkFsZXJ0Q29uZmlnLCBOZ2JBbGVydH0gZnJvbSAnLi9hbGVydC9hbGVydC5tb2R1bGUnO1xuZXhwb3J0IHtOZ2JCdXR0b25zTW9kdWxlLCBOZ2JDaGVja0JveCwgTmdiUmFkaW9Hcm91cH0gZnJvbSAnLi9idXR0b25zL2J1dHRvbnMubW9kdWxlJztcbmV4cG9ydCB7TmdiQ2Fyb3VzZWxNb2R1bGUsIE5nYkNhcm91c2VsQ29uZmlnLCBOZ2JDYXJvdXNlbCwgTmdiU2xpZGV9IGZyb20gJy4vY2Fyb3VzZWwvY2Fyb3VzZWwubW9kdWxlJztcbmV4cG9ydCB7TmdiQ29sbGFwc2VNb2R1bGUsIE5nYkNvbGxhcHNlfSBmcm9tICcuL2NvbGxhcHNlL2NvbGxhcHNlLm1vZHVsZSc7XG5leHBvcnQge1xuICBOZ2JDYWxlbmRhcixcbiAgTmdiUGVyaW9kLFxuICBOZ2JDYWxlbmRhcklzbGFtaWNDaXZpbCxcbiAgTmdiQ2FsZW5kYXJJc2xhbWljVW1hbHF1cmEsXG4gIE5nYkNhbGVuZGFySGVicmV3LFxuICBOZ2JDYWxlbmRhclBlcnNpYW4sXG4gIE5nYkRhdGVwaWNrZXJNb2R1bGUsXG4gIE5nYkRhdGVwaWNrZXJJMThuLFxuICBOZ2JEYXRlcGlja2VySTE4bkhlYnJldyxcbiAgTmdiRGF0ZXBpY2tlckNvbmZpZyxcbiAgTmdiRGF0ZVN0cnVjdCxcbiAgTmdiRGF0ZSxcbiAgTmdiRGF0ZVBhcnNlckZvcm1hdHRlcixcbiAgTmdiRGF0ZUFkYXB0ZXIsXG4gIE5nYkRhdGVOYXRpdmVBZGFwdGVyLFxuICBOZ2JEYXRlTmF0aXZlVVRDQWRhcHRlcixcbiAgTmdiRGF0ZXBpY2tlcixcbiAgTmdiSW5wdXREYXRlcGlja2VyXG59IGZyb20gJy4vZGF0ZXBpY2tlci9kYXRlcGlja2VyLm1vZHVsZSc7XG5leHBvcnQge05nYkRyb3Bkb3duTW9kdWxlLCBOZ2JEcm9wZG93bkNvbmZpZywgTmdiRHJvcGRvd259IGZyb20gJy4vZHJvcGRvd24vZHJvcGRvd24ubW9kdWxlJztcbmV4cG9ydCB7XG4gIE5nYk1vZGFsTW9kdWxlLFxuICBOZ2JNb2RhbCxcbiAgTmdiTW9kYWxDb25maWcsXG4gIE5nYk1vZGFsT3B0aW9ucyxcbiAgTmdiQWN0aXZlTW9kYWwsXG4gIE5nYk1vZGFsUmVmLFxuICBNb2RhbERpc21pc3NSZWFzb25zXG59IGZyb20gJy4vbW9kYWwvbW9kYWwubW9kdWxlJztcbmV4cG9ydCB7TmdiUGFnaW5hdGlvbk1vZHVsZSwgTmdiUGFnaW5hdGlvbkNvbmZpZywgTmdiUGFnaW5hdGlvbn0gZnJvbSAnLi9wYWdpbmF0aW9uL3BhZ2luYXRpb24ubW9kdWxlJztcbmV4cG9ydCB7TmdiUG9wb3Zlck1vZHVsZSwgTmdiUG9wb3ZlckNvbmZpZywgTmdiUG9wb3Zlcn0gZnJvbSAnLi9wb3BvdmVyL3BvcG92ZXIubW9kdWxlJztcbmV4cG9ydCB7TmdiUHJvZ3Jlc3NiYXJNb2R1bGUsIE5nYlByb2dyZXNzYmFyQ29uZmlnLCBOZ2JQcm9ncmVzc2Jhcn0gZnJvbSAnLi9wcm9ncmVzc2Jhci9wcm9ncmVzc2Jhci5tb2R1bGUnO1xuZXhwb3J0IHtOZ2JSYXRpbmdNb2R1bGUsIE5nYlJhdGluZ0NvbmZpZywgTmdiUmF0aW5nfSBmcm9tICcuL3JhdGluZy9yYXRpbmcubW9kdWxlJztcbmV4cG9ydCB7XG4gIE5nYlRhYnNldE1vZHVsZSxcbiAgTmdiVGFiQ2hhbmdlRXZlbnQsXG4gIE5nYlRhYnNldENvbmZpZyxcbiAgTmdiVGFic2V0LFxuICBOZ2JUYWIsXG4gIE5nYlRhYkNvbnRlbnQsXG4gIE5nYlRhYlRpdGxlXG59IGZyb20gJy4vdGFic2V0L3RhYnNldC5tb2R1bGUnO1xuZXhwb3J0IHtcbiAgTmdiVGltZXBpY2tlck1vZHVsZSxcbiAgTmdiVGltZXBpY2tlckNvbmZpZyxcbiAgTmdiVGltZVN0cnVjdCxcbiAgTmdiVGltZXBpY2tlcixcbiAgTmdiVGltZUFkYXB0ZXJcbn0gZnJvbSAnLi90aW1lcGlja2VyL3RpbWVwaWNrZXIubW9kdWxlJztcbmV4cG9ydCB7TmdiVG9vbHRpcE1vZHVsZSwgTmdiVG9vbHRpcENvbmZpZywgTmdiVG9vbHRpcH0gZnJvbSAnLi90b29sdGlwL3Rvb2x0aXAubW9kdWxlJztcbmV4cG9ydCB7XG4gIE5nYkhpZ2hsaWdodCxcbiAgTmdiVHlwZWFoZWFkTW9kdWxlLFxuICBOZ2JUeXBlYWhlYWRDb25maWcsXG4gIE5nYlR5cGVhaGVhZFNlbGVjdEl0ZW1FdmVudCxcbiAgTmdiVHlwZWFoZWFkXG59IGZyb20gJy4vdHlwZWFoZWFkL3R5cGVhaGVhZC5tb2R1bGUnO1xuXG5leHBvcnQge1BsYWNlbWVudH0gZnJvbSAnLi91dGlsL3Bvc2l0aW9uaW5nJztcblxuY29uc3QgTkdCX01PRFVMRVMgPSBbXG4gIE5nYkFjY29yZGlvbk1vZHVsZSwgTmdiQWxlcnRNb2R1bGUsIE5nYkJ1dHRvbnNNb2R1bGUsIE5nYkNhcm91c2VsTW9kdWxlLCBOZ2JDb2xsYXBzZU1vZHVsZSwgTmdiRGF0ZXBpY2tlck1vZHVsZSxcbiAgTmdiRHJvcGRvd25Nb2R1bGUsIE5nYk1vZGFsTW9kdWxlLCBOZ2JQYWdpbmF0aW9uTW9kdWxlLCBOZ2JQb3BvdmVyTW9kdWxlLCBOZ2JQcm9ncmVzc2Jhck1vZHVsZSwgTmdiUmF0aW5nTW9kdWxlLFxuICBOZ2JUYWJzZXRNb2R1bGUsIE5nYlRpbWVwaWNrZXJNb2R1bGUsIE5nYlRvb2x0aXBNb2R1bGUsIE5nYlR5cGVhaGVhZE1vZHVsZVxuXTtcblxuQE5nTW9kdWxlKHtpbXBvcnRzOiBOR0JfTU9EVUxFUywgZXhwb3J0czogTkdCX01PRFVMRVN9KVxuZXhwb3J0IGNsYXNzIE5nYk1vZHVsZSB7XG4gIC8qKlxuICAgKiBJbXBvcnRpbmcgd2l0aCAnLmZvclJvb3QoKScgaXMgbm8gbG9uZ2VyIG5lY2Vzc2FyeSwgeW91IGNhbiBzaW1wbHkgaW1wb3J0IHRoZSBtb2R1bGUuXG4gICAqIFdpbGwgYmUgcmVtb3ZlZCBpbiA0LjAuMC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgMy4wLjBcbiAgICovXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMgeyByZXR1cm4ge25nTW9kdWxlOiBOZ2JNb2R1bGV9OyB9XG59XG4iXSwibmFtZXMiOlsibmV4dElkIiwiTkdCX0RBVEVQSUNLRVJfVkFMVUVfQUNDRVNTT1IiLCJtb2QiLCJHUkVHT1JJQU5fRVBPQ0giLCJpc0dyZWdvcmlhbkxlYXBZZWFyIiwiZnJvbUdyZWdvcmlhbiIsInRvR3JlZ29yaWFuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLFNBQWdCLFNBQVMsQ0FBQyxLQUFVO0lBQ2xDLE9BQU8sUUFBUSxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFD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QWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYzs7SUFFOUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7O0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjOztJQUU5RSxjQUFjO0NBQ2Y7Ozs7OztBQUVELFNBQVMsV0FBVyxDQUFDLEtBQVcsRUFBRSxLQUFXOztVQUNyQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3hELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxD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