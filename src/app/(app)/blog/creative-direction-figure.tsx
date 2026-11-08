export function CreativeDirectionFigure() {
  return (
    <figure className="blog-direction">
      <div className="blog-direction-heading">
        <span className="label-editorial text-gold">
          The brief changes the work
        </span>
        <span className="label-editorial">Conceptual illustration</span>
      </div>
      <div className="blog-direction-paths">
        <section
          className="blog-direction-path"
          aria-label="An open-ended brief"
        >
          <p className="label-editorial">01 / Broad prompt</p>
          <h2>“Make a bakery website.”</h2>
          <p className="blog-direction-context">
            Audience, character, and priorities left open.
          </p>
          <div className="blog-direction-execution">
            <span aria-hidden="true">↓</span>
            <p>AI explores layouts and builds the page.</p>
          </div>
          <div className="blog-direction-result">
            <p className="label-editorial">Familiar choices fill the gaps</p>
            <p>A generous hero. Rounded cards. A polished template.</p>
            <div
              className="blog-example blog-example-template"
              aria-hidden="true"
            >
              <div className="blog-example-toolbar">
                <span />
                <span />
                <span />
              </div>
              <div className="blog-example-hero">
                <span className="blog-example-eyebrow">
                  Freshly baked. Every day.
                </span>
                <span className="blog-example-title">Made with love.</span>
                <span className="blog-example-button">
                  Discover our story ↗
                </span>
              </div>
              <div className="blog-example-cards">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </section>
        <section
          className="blog-direction-path blog-direction-chosen"
          aria-label="A deliberately chosen direction"
        >
          <p className="label-editorial text-gold">
            02 / Lived context + taste
          </p>
          <h2>“Our regulars need tomorrow’s bread list.”</h2>
          <p className="blog-direction-context">
            The handwritten counter sign feels right. Put pickup times first;
            skip the sales pitch.
          </p>
          <div className="blog-direction-execution">
            <span aria-hidden="true">↓</span>
            <p>AI explores layouts and builds the page.</p>
          </div>
          <div className="blog-direction-result">
            <p className="label-editorial text-gold">
              A direction someone chose
            </p>
            <p>
              A daily bread board, clear pickup times, the shop’s own voice.
            </p>
            <div className="blog-example blog-example-board" aria-hidden="true">
              <span className="blog-example-eyebrow">
                The corner bakery / Tomorrow
              </span>
              <span className="blog-example-title">At the counter.</span>
              <div className="blog-example-bread">
                <span>Slow-fermented sourdough</span>
                <span>Rye &amp; sunflower</span>
                <span>Still-warm cinnamon buns</span>
              </div>
              <span className="blog-example-pickup">Collect from 8–11am →</span>
            </div>
          </div>
        </section>
      </div>
      <p className="blog-direction-game">
        In a game, the same distinction: “make a platformer” supplies a familiar
        starting point; “make the player hesitate before a harmless-looking
        jump” gives the prototype a feeling to test.
      </p>
      <figcaption>
        <span className="text-gold">Fig. 01</span> Illustrative choices, not
        measured outcomes. AI can contribute ideas and execution in both cases;
        context gives people and models something specific to question and
        refine.
      </figcaption>
    </figure>
  )
}

export function CreativeDirectionThumbnail() {
  return (
    <svg viewBox="0 0 190 150" fill="none" aria-hidden="true">
      <rect
        x="12"
        y="15"
        width="70"
        height="105"
        stroke="currentColor"
        opacity="0.45"
      />
      <rect
        x="21"
        y="26"
        width="52"
        height="30"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M21 67h52M21 77h52M21 87h31"
        stroke="currentColor"
        opacity="0.5"
      />
      <rect
        x="100"
        y="28"
        width="77"
        height="105"
        className="blog-thumbnail-board"
      />
      <path
        d="M111 48h53M111 57h34M111 78h26m11 0h15M111 92h26m11 0h15M111 106h26m11 0h15"
        stroke="currentColor"
      />
      <path d="m83 130 8 5 8-5M91 121v14" stroke="currentColor" />
    </svg>
  )
}
