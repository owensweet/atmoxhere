export const SIZES = ['1', '2', '3', '4']
export const ONE_SIZE = 'misc';

export function totalStock(product) {
    return Object.values(product.sizes ?? {}).reduce((sum, n) => sum + n, 0);
}

export function inStock(product) {
    return totalStock(product) > 0 || product.stock > 0;
}

export function hasSizes(product) {
    return product.sizes && !(ONE_SIZE in (product.sizes));
}

// returns amount available of a size where size is 1-4 and "misc"
// if the size entered doesnt exist it returns 0
export function sizeStock(product, size) {
    return product?.sizes?.[size] ?? 0
}