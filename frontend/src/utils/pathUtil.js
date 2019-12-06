import path from 'path';
import upath from 'upath';

const getBaseName = url => {
    return path.basename(upath.normalize(url));
}

export default getBaseName;