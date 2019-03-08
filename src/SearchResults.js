import React, { Component } from 'react';
import parser from 'html-react-parser';
import Autosuggest from 'react-autosuggest';

class SearchResults extends Component {

    constructor() {
        super()
        this.state = {
            products: [],
            value: '',
            suggestions: []
        }
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    // Autosuggest will call this function every time you need to update suggestions.
    onSuggestionsFetchRequested = ({ value }) => {
        console.time('Suggest');
        // Do the search
        fetch(`http://localhost:5000/suggest?suggest=${this.state.value}`)
            .then(result => {
                console.timeEnd('Suggest');
                return result.json();
            }).then(data => {
                this.setState({
                    suggestions: data
                });
            });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    getSuggestionValue = suggestion => suggestion.name;

    // Use your imagination to render suggestions.
    renderSuggestion = suggestion => (
        <div>
            {suggestion.name}
        </div>
    );

    queryProducts = () => {
        console.time('Query');
        // Do the search
        fetch(`http://localhost:5000/search?search=${this.state.value}`)
            .then(result => {
                console.timeEnd('Query');
                return result.json();
            }).then(data => {
                // foreach row render the name of the employee
                let prodData = data.map((prodRec, i) => {
                    return (
                        <div className="TableRow">
                            <div className="TableCell">
                                {parser(prodRec.company)}
                            </div>
                            <div className="TableCell">
                                <div>{parser(prodRec.product)}</div>
                            </div>
                            <div className="TableCell">
                                <div>{parser(prodRec.color)}</div>
                            </div>
                            <div className="TableCell">
                                <div>{parser(prodRec.price)}</div>
                            </div>
                        </div>
                    )
                });
                this.setState({ products: prodData });
            });
    }

    render() {
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Type product or search anything...',
            value,
            onChange: this.onChange
        };

        return (
            <div className="SearchResults">
                <div className="header">
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={this.getSuggestionValue}
                        renderSuggestion={this.renderSuggestion}
                        inputProps={inputProps}
                    />
                    <button onClick={this.queryProducts}> Search </button>
                </div>
                <span style={{ display: 'block', height: 10 }}></span>
                <div class="ResultsTable">
                    <div class="TableRow">
                        <div class="TableHead"><strong>Company</strong></div>
                        <div class="TableHead"><strong>Product</strong></div>
                        <div class="TableHead"><strong>Color</strong></div>
                        <div class="TableHead"><strong>Price</strong></div>
                    </div>
                    <div>{this.state.products}</div>
                </div>
            </div>
        )
    }
}

export default SearchResults