import { ReactElement, Suspense } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

declare global {
	// eslint-disable-next-line 
	interface Window { renderReactComponent: any; }
}
window.renderReactComponent = window.renderReactComponent || {};
/**
 * Define os providers a serem utilizados pelos componentes.
 *
 * Aqui podem ser declarados providers como o Redux, React Router, Style Theme, etc.
 */
type ProvidersProps = {
	children: ReactElement
}


const Providers = ({ children }: ProvidersProps) => {
	return (
		<Suspense fallback="Carregando ...">
			{children}
		</Suspense>
	);
};

/**
 * Cria a função que irá renderizar o componente.
 *
 * Tal função é injetada no objeto window, para que possa ser acessada de qualquer local na aplicação legada.
 *
 * Exemplo:
 *
 * ```html
 * <div id="element-root"></div>
 *
 * <script>
 *   const elementRoot = document.getElementById('element-root');
 *
 *   window.renderReactComponent.NomeDoComponente(props, elementRoot);
 * </script>
 * ```
 *
 * Caso o elementRoot não seja informado, o componente será renderizado no elemento pai do script que chamou a função.
 *
 * Exemplo:
 *
 * ```html
 * <div id="element-root">
 *   <script>
 *     window.renderReactComponent.NomeDoComponente(props);
 *   </script>
 * </div>
 * ```
 *
 * Caso esteja rodando em modo de desenvolvimento, o componente será renderizado no elemento com id 'root'.
 */
type CreateEntryProps = {
	name: string
	component: React.FC,
}

export const createEntry = ({
	name,
	component: Component,
}: CreateEntryProps) => {
	if (window.renderReactComponent[name]) {
		throw new Error('Already exists component with name ' + name);
	}

	window.renderReactComponent[name] = (props: any, elementRoot: HTMLElement) => {
		const root = createRoot(elementRoot || document?.currentScript?.parentNode);
		root.render(
			<Providers>
				<Component {...props} />
			</Providers>,
		);
	};

	if (process.env.NODE_ENV === 'development') {
		window.renderReactComponent[name]({}, document.getElementById('root'));
	}
};
