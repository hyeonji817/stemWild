import type { Animal } from '../animals';

export function AnimalArt({ animal }: { animal: Animal }) {
  return <img src={`/animals/${animal.type}.svg?v=5`} alt={`${animal.name} 캐릭터 ${animal.nick}`} width="300" height="300" />;
}

export function AnimalDetails({ animal, heading = '당신의 야생 친구는' }: { animal: Animal; heading?: string }) {
  return <>
    <div className="eyebrow">{heading}</div>
    <div className="detail-art"><AnimalArt animal={animal} /></div>
    <div className="traits">{animal.stem} {animal.han} · {animal.nick}</div>
    <h2>{animal.name}</h2><strong>{animal.trait}</strong>
    <p>{animal.bio}</p><div className="traits">{animal.tags}</div>
    <p className="conservation">{animal.care}</p>
  </>;
}
