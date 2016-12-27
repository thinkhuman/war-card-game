import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import GameComponent from './App';
import ButtonComponent from './App';
import CardComponent from './App';
import StatusComponent from './App';



// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<GameComponent />, div);
// });


describe('GameComponent', () => {

    it('renders without exploding', () => {
         expect(
             shallow(
             	<GameComponent />
             	).length
             ).toEqual(1);
    });

    it('renders appropriate game board');
    it('randomly splits deck in two halves and assigns each to a player')
    it('declares WAR if both player cards are equal');
    it('runs the appropriate method when the button is clicked');
	
});


describe('ButtonComponent', () => {

    it('renders without exploding', () => {
         expect(
             shallow(
             	<ButtonComponent />
             	).length
             ).toEqual(1);
    });

    it('returns a button with a label');
    it('sets the correct state when button is clicked');
    it('displays a random card for each player when button is clicked');
    it('has the correct button label for the current state');
	
});


describe('CardComponent', () => {

    it('renders without exploding', () => {
         expect(
             shallow(
             	<CardComponent />
             	).length
             ).toEqual(1);
    });

    it('renders the correct card count');
    it('renders the card back image at start of game');
    it('renders a random card image for each player');
	
});


describe('StatusComponent', () => {

    it('renders without exploding', () => {
         expect(
             shallow(
             	<StatusComponent />
             	).length
             ).toEqual(1);
    });

    it('should have props for winner, status, won, war, message', () => {
        const wrapper = shallow(<StatusComponent/>);
        expect(wrapper.props().winner).to.be.defined;
        expect(wrapper.props().status).to.be.defined;
        expect(wrapper.props().won).to.be.defined;
        expect(wrapper.props().war).to.be.defined;
        expect(wrapper.props().message).to.be.defined;
    });

    it('returns appropriate status message');

	
});





