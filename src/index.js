import register from 'preact-custom-element';
import SwButton from "./sw-button/sw-button.jsx";
import SwTextInput from './sw-text-input/sw-text-input';
import SwLoader from "./sw-loader/sw-loader.jsx";
import SwPagination from './sw-pagination/sw-pagination';
import SwTable from "./sw-table/sw-table.jsx";

register(SwButton, 'sw-button', ['icon', 'disabled'], { shadow: true });
register(SwTextInput, 'sw-input', ['id', 'required', 'placeholder'], { shadow: true });
register(SwLoader, 'sw-loader', [], { shadow: true });
register(SwPagination, 'sw-pagination', ['current-page', 'number-of-pages'], { shadow: true });
register(SwTable, 'sw-table', ['source', 'fields'], { shadow: true });
