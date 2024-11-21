function css( element, property ) {
    return window.getComputedStyle( element, null ).getPropertyValue( property );
}

export default css
