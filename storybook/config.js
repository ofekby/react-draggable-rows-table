import { configure } from '@storybook/react';

function loadStories() {
    require('./story1');
}

configure(loadStories, module);