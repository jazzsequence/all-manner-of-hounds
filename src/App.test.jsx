import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

const list = () => screen.getByRole('list', { name: /generated hound names/i });

describe('App', () => {
	it('opens with a kennel already named', () => {
		render(<App />);
		expect(within(list()).getAllByRole('listitem')).toHaveLength(3);
	});

	it('names as many houndis as asked for', async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByRole('radio', { name: '6' }));
		await user.click(screen.getByRole('button', { name: /nameth the houndis/i }));

		expect(within(list()).getAllByRole('listitem')).toHaveLength(6);
	});

	it('draws only from the chosen letter', async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.selectOptions(screen.getByRole('combobox', { name: /after the a.b.c./i }), 'Z');
		await user.click(screen.getByRole('button', { name: /nameth the houndis/i }));

		for (const item of within(list()).getAllByRole('listitem')) {
			expect(item.textContent).toMatch(/Z/);
		}
		expect(screen.getByText(/names in the kennel under Z/i)).toBeTruthy();
	});

	it('copies the drawn names to the clipboard', async () => {
		const user = userEvent.setup();
		render(<App />);

		const names = within(list())
			.getAllByRole('listitem')
			.map((item) => item.querySelector('.hound-name').textContent);

		await user.click(screen.getByRole('button', { name: /^copy$/i }));

		expect(await navigator.clipboard.readText()).toBe(names.join('\n'));
		expect(screen.getByRole('button', { name: /copied/i })).toBeTruthy();
	});

	it('credits the full manuscript', () => {
		render(<App />);
		expect(screen.getByText(/All 1,065 names come from/i)).toBeTruthy();
	});
});
