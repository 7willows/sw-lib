import * as stm from '../../utils/state-mgr/state-mgr';

stm.component({
    tagName: 'sw-mini-loader',
    shadow: true,
    init: () => [{}, null],
    update: (state) => [state, null],
    view: () => <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        viewBox="0 0 24 30" enable-background="new 0 0 0 0">
        <style>
            {`
             rect { fill: var(--color); }
             :host { display: inline-block; width: 24px; height: 30px; }
            `}
        </style>
        <rect x="0" y="0" width="4" height="10" fill="red">
            <animateTransform attributeType="xml"
                attributeName="transform" type="translate"
                values="0 0; 0 20; 0 0"
                begin="0" dur="0.6s" repeatCount="indefinite" />
        </rect>
        <rect x="10" y="0" width="4" height="10" fill="red">
            <animateTransform attributeType="xml"
                attributeName="transform" type="translate"
                values="0 0; 0 20; 0 0"
                begin="0.2s" dur="0.6s" repeatCount="indefinite" />
        </rect>
        <rect x="20" y="0" width="4" height="10" fill="red">
            <animateTransform attributeType="xml"
                attributeName="transform" type="translate"
                values="0 0; 0 20; 0 0"
                begin="0.4s" dur="0.6s" repeatCount="indefinite" />
        </rect>
    </svg>
});
