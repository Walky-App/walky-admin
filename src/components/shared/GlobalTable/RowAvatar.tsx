

export default function Avatar({ src, alt = 'avatar' }: { src: any; alt?: any }) {
  return <img src={src} alt={alt} className="w-8 h-8 rounded-full object-cover" />
}

