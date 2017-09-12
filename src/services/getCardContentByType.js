import GitHub from '../components/cardcontents/GitHub';
import DefaultContent from '../components/cardcontents/DefaultContent';
import Dribbble from '../components/cardcontents/Dribbble';
import ProductHunt from '../components/cardcontents/ProductHunt';
import Feedly from '../components/cardcontents/Feedly';

export default (type: string) => {
    switch (type) {
        case 'producthunt':
            return ProductHunt;
        case 'github':
            return GitHub;
        case 'dribbble':
            return Dribbble;
        case 'feedly':
            return Feedly;
        default:
            return DefaultContent;
    }
};
