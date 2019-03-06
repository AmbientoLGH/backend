/**
 * Converting Hex-Color-Values into RGB-Objects (#ffffff -> {r: 255, r: 255, b: 255})
 * @param hex {String}
 * @returns {Object}
 */
function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

module.exports = {
    hexToRgb
};