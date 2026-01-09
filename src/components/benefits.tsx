const benefits = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Accès prioritaire",
    description: "Soyez parmi les premiers à commander",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
    title: "-15% early bird",
    description: "Réduction exclusive pour les premiers inscrits",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    ),
    title: "Livraison offerte",
    description: "Sur votre première commande",
  },
]

export function Benefits(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
      {benefits.map((benefit, index) => (
        <div
          key={benefit.title}
          className="flex flex-col items-center text-center p-4 opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${(index + 3) * 100}ms`, animationFillMode: "forwards" }}
        >
          <div className="w-12 h-12 rounded-full bg-kizento-primary/10 flex items-center justify-center text-kizento-primary mb-3">
            {benefit.icon}
          </div>
          <h3 className="font-medium text-kizento-text mb-1">{benefit.title}</h3>
          <p className="text-sm text-muted-foreground">{benefit.description}</p>
        </div>
      ))}
    </div>
  )
}
