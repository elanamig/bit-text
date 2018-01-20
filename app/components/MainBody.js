import React from 'react';
import { Image, Segment, Menu, Header, Container, Button, Visibility, Icon } from 'semantic-ui-react'
import Typist from 'react-typist';
export default function (props) {
    return (
        <Container text>
            <Header
            as='h1'
            inverted
            style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0, marginTop: '3em' }}
            ><Typist cursor={{hideWhenDone: true}}>
            <span>The Era of A Dozen Scattered Payment Apps is Over.</span>
                <Typist.Backspace count={50} delay={1000} />
            <span>All Your Transactions, In One Place, Over Secure Text. </span>
            <Typist.Backspace count={59} delay={1000} />
            <span>Welcome to BitText.</span>
            </Typist>
            </Header>
            <Header
            as='h2'
            content='Pay The Convenient Way.'
            inverted
            style={{ fontSize: '1.7em', fontWeight: 'normal' }}
            />
            <Button primary size='huge'>
            Get Started
            <Icon name='right arrow' />
            </Button>
            </Container>
    )
}


 