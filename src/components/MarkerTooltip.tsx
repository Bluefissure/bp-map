

import { Marker, Popup } from 'react-leaflet';
import { getLocalText } from './MapContainer';
import { Trans } from 'react-i18next';
import { MapBoss, MapHabitat, MapMarker } from '../types/MapMarker';

const markerTooltipContentRender = (marker: MapMarker, dataLang: string) => {
    const { dataType, content } = marker;
    if (Array.isArray(content)) {
        if (['GatherPoint', 'TreasureBox', 'FreeBuff'].indexOf(dataType) !== -1) {
            const header = (<div className='font-extrabold mb-2'>{marker.markerType}</div>);
            return (
                <>
                    {header}
                    {content.map((tr)=> (
                        <div className="flex justify-between items-center" key={tr.key}>
                            <div>
                                {tr.name}
                            </div>
                            <div className="space-x-4">
                                <span>{tr.amount}</span>
                                <span> </span>
                            </div>
                            <div >
                                {tr.rate}
                            </div>
                        </div>
                    ))}
                </>
            );
        }
    } else {
        if (dataType === 'WarpPoint') {
            const header = (<div className='font-extrabold mb-2'>{marker.markerType}</div>);
            return (
                <>
                    {header}
                    {content.name}
                </>
            );
        } else if (dataType === 'Boss') {
            const header = (<div className='font-extrabold'>{content.name}</div>);
            const member = (content as MapBoss).data?.members[0];
            const minLv = member?.MinLv ?? 0;
            const maxLv = member?.MaxLv ?? 0;
            let lvStr = `Lv.${minLv}`;
            if (maxLv !== minLv) {
                lvStr += `~${maxLv}`;
            }
            const cdStr = (content as MapBoss).questData?.cool_time ?? 0;
            const lvCdDom = (
                <div className="flex justify-between items-center mb-1">
                    <div className='text-xs'>{lvStr}</div>
                    <div className="space-x-4">
                        <span> </span>
                        <span> </span>
                    </div>
                    <div className='text-xs'>
                        <Trans
                            i18nKey={'bossCondition.cd'}
                            defaults='CD: {{cd}}m'
                            values={{cd: cdStr}}
                        />
                    </div>
                </div>
            );
            const conditionsDom = [] as JSX.Element[];
            const conditions = (content as MapBoss).questData?.conditions;
            if (conditions) {
                if(conditions[1].type === 2 || conditions[1].type === 3){
                    conditionsDom.push((
                        <li key="cond_1">
                            <Trans i18nKey={
                                conditions[1].type === 3
                                    ? 'bossCondition.appearsAtNight'
                                    : 'bossCondition.appearsDuringTheDay'
                            }>
                                Appears {conditions[1].type === 3 ? 'at night' : 'during the day'}
                            </Trans>
                        </li>
                    ))
                }
                const keyList = ['2_1', '2_2', '2_3'];
                keyList.forEach((key) => {
                    const entry = conditions[key] ?? {};
                    if (entry.type === 1) {
                        conditionsDom.push((
                            <li key={`cond_${key}`}>
                                <Trans
                                    i18nKey={'bossCondition.killEnemies'}
                                    defaults="Kill {{amount}} {{enemy}}"
                                    values={{
                                        amount: entry.params[1],
                                        enemy: getLocalText(entry.name, dataLang),
                                    }}
                                />
                            </li>
                        ))
                    } else if (entry.type === 2) {
                        conditionsDom.push((
                            <li key={`cond_${key}`}>
                                <Trans
                                    i18nKey={'bossCondition.playerNearby'}
                                    defaults="Player nearby for {{amount}} minites"
                                    values={{
                                        amount: Number.parseInt(entry.params[0]),
                                    }}
                                />
                            </li>
                        ))
                    } else if (entry.type === 3 && entry.params[0].indexOf('Gimmick') !== -1) {
                        conditionsDom.push((
                            <li key={`cond_${key}`}>
                                <Trans
                                    i18nKey={'bossCondition.openTreasureBox'}
                                    defaults="Open treasure box"
                                />
                            </li>
                        ))
                    } else if (entry.type === 8) {
                        conditionsDom.push((
                            <li key={`cond_${key}`}>
                                <Trans
                                    i18nKey={'bossCondition.numberOfPlayersOnMount'}
                                    defaults="{{amount}} players on mount around"
                                    values={{
                                        amount: Number.parseInt(entry.params[0]),
                                    }}
                                />
                            </li>
                        ))
                    } else if (entry.type === 9) {
                        conditionsDom.push((
                            <li key={`cond_${key}`}>
                                <Trans
                                    i18nKey={'bossCondition.numberOfPlayers'}
                                    defaults="{{amount}} players around"
                                    values={{
                                        amount: Number.parseInt(entry.params[0]),
                                    }}
                                />
                            </li>
                        ))
                    } else if (entry.type === 10) {
                        conditionsDom.push((
                            <li key={`cond_${key}`}>
                                <Trans
                                    i18nKey={'bossCondition.playerOfLuno'}
                                    defaults="Player with {{amount}} luno around"
                                    values={{
                                        amount: Number.parseInt(entry.params[0]),
                                    }}
                                />
                            </li>
                        ))
                    } else if (entry.type === 11) {
                        conditionsDom.push((
                            <li key={`cond_${key}`}>
                                <Trans
                                    i18nKey={'bossCondition.playerWithDebuff'}
                                    defaults="Player with debuff around"
                                />
                            </li>
                        ))
                    } else if (entry.type > 0){
                        conditionsDom.push((
                            <li key={`cond_${key}`}>
                                <Trans
                                    i18nKey={'bossCondition.unknownCondition'}
                                    defaults="Unknown condition ({{type}})"
                                    values={{
                                        type: entry.type,
                                    }}
                                />
                            </li>
                        ))
                    }
                })
            }
            return (
                <>
                    {header}
                    {lvCdDom}
                    <div>
                        <Trans
                            i18nKey={'bossCondition.conditions'}
                            defaults="Conditions:"
                        />
                        {conditionsDom}
                    </div>
                    <div className='mb-2'>
                        <Trans
                            i18nKey={'bossCondition.drops'}
                            defaults="Drops:"
                        />
                        {member?.Drops.filter((drop) => (drop.name)).sort(
                            (x, y) => (y.drop_rate - x.drop_rate)).map(
                            (drop, idx) => (
                                <div className="flex justify-between items-center" key={`habi-drop-${idx}`}>
                                    <div>
                                        {getLocalText(drop.name, dataLang)}
                                    </div>
                                    <div className="space-x-4">
                                        <span> </span>
                                        <span> </span>
                                    </div>
                                    <div >
                                        {`${Math.floor(drop.drop_rate) / 100}%`}
                                    </div>
                                </div>
                            ))}
                    </div>
                </>
            );
        } else if (dataType === 'Habitat') {
            return (
                <div className="overflow-auto max-h-52">
                    {(content as MapHabitat).data?.members.map((member, idx) => {
                        const minLv = member.MinLv ?? 0;
                        const maxLv = member.MaxLv ?? 0;
                        let lvStr = `Lv.${minLv}`;
                        if (maxLv !== minLv) {
                            lvStr += `~${maxLv}`;
                        }
                        return (
                            <div key={`habi-member-${idx}`}>
                                <div className='font-extrabold' key={`${content.key}_${member.EnemyId}`}>
                                    {getLocalText(member.Name, dataLang)}
                                </div>
                                <div className='text-xs mb-1'>{lvStr}</div>
                                <div className='mb-2'>
                                    {member.Drops.filter((drop) => (drop.name)).sort(
                                        (x, y) => (y.drop_rate - x.drop_rate)).map(
                                        (drop, idx) => (
                                            <div className="flex justify-between items-center" key={`habi-drop-${idx}`}>
                                                <div>
                                                    {getLocalText(drop.name, dataLang)}
                                                </div>
                                                <div className="space-x-4">
                                                    <span> </span>
                                                    <span> </span>
                                                </div>
                                                <div >
                                                    {`${Math.floor(drop.drop_rate) / 100}%`}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        );
                            
                    })}
                </div>
            )
        }
    }
    return (<div className='font-extrabold mb-2'>{marker.markerType}</div>);
};


export const markerTooltipRender = (
    marker: MapMarker,
    dataLang: string,
    onMarkerPopupShow?: (marker: MapMarker, show: boolean) => void,
) => (
    <Marker
        position={marker.position}
        icon={marker.icon}
        key={marker.key}
        zIndexOffset={marker.zIndex * 1000}
        eventHandlers={{
            popupopen: () => {
                onMarkerPopupShow?.(marker, true);
            },
            popupclose: () => {
                onMarkerPopupShow?.(marker, false);
            },
        }}
    >
        <Popup
            className='w-auto max-w-6xl'
            maxWidth={500}
        >
            {markerTooltipContentRender(marker, dataLang)}
        </Popup>
    </Marker>
);