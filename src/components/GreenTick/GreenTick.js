import React from 'react';

import star from '../../global/assets/icons/star.svg';
import tick from '../../global/assets/icons/tick.svg';

const GreenTick = () => {
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <img src={star} alt={''}/>
            <img style={{position: 'relative', marginLeft:'-50%'}} src={tick} alt={'Checked'} />
        </div>
    )
}

export default GreenTick;